// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract BlockVote {
    uint256 public constant VOTE_COST = 0.001 ether;
    uint256 public constant POLL_CREATION_FEE = 0.005 ether;
    uint256 public constant MAX_POLL_DURATION = 30 days;
    uint256 public constant CLEANUP_DELAY = 24 hours;
    uint256 public pollCount;
    address public platformWallet;

    struct Option {
        string text;
        uint256 votes;
    }

    struct Poll {
        uint256 id;
        string question;
        address creator;
        uint256 createdAt;
        uint256 expiresAt;
        uint256 finalizedAt;
        bool finalized;
        bool deleted;
        uint256 totalVotes;
        uint256 totalFunds;
        uint256 betOptionIndex;
        bool hasBet;
        uint256 duration;
        Option[] options;
        mapping(address => bool) hasVoted;
    }

    mapping(uint256 => Poll) public polls;
    mapping(address => uint256[]) public userPolls;

    event PollCreated(uint256 indexed pollId, address indexed creator, string question, uint256 duration, uint256 optionCount);
    event VoteCast(uint256 indexed pollId, address indexed voter, uint256 optionIndex);
    event PollFinalized(uint256 indexed pollId, uint256 winningOption, uint256 creatorPayout, uint256 platformPayout);
    event PollDeleted(uint256 indexed pollId);

    constructor(address _platformWallet) {
        platformWallet = _platformWallet;
    }

    function createPoll(
        string memory _question,
        string[] memory _options,
        uint256 _betOptionIndex,
        bool _hasBet,
        uint256 _durationInHours
    ) external payable returns (uint256) {
        require(_options.length >= 2 && _options.length <= 6, "Must have 2-6 options");
        require(_durationInHours > 0, "Duration must be positive");

        uint256 durationInSeconds = _durationInHours * 1 hours;
        require(durationInSeconds <= MAX_POLL_DURATION, "Duration exceeds maximum");

        uint256 requiredFee = POLL_CREATION_FEE;
        if (_hasBet) {
            requiredFee += VOTE_COST;
            require(_betOptionIndex < _options.length, "Invalid bet option");
        }
        require(msg.value >= requiredFee, "Insufficient creation fee");

        pollCount++;
        Poll storage newPoll = polls[pollCount];
        newPoll.id = pollCount;
        newPoll.question = _question;
        newPoll.creator = msg.sender;
        newPoll.createdAt = block.timestamp;
        newPoll.duration = durationInSeconds;
        newPoll.expiresAt = block.timestamp + durationInSeconds;
        newPoll.betOptionIndex = _betOptionIndex;
        newPoll.hasBet = _hasBet;

        for (uint256 i = 0; i < _options.length; i++) {
            newPoll.options.push(Option({
                text: _options[i],
                votes: 0
            }));
        }

        uint256 platformFee = POLL_CREATION_FEE;

        if (_hasBet) {
            newPoll.options[_betOptionIndex].votes = 1;
            newPoll.totalVotes = 1;
            newPoll.totalFunds = VOTE_COST;
            newPoll.hasVoted[msg.sender] = true;
        }

        (bool success, ) = platformWallet.call{value: platformFee}("");
        require(success, "Platform fee transfer failed");

        userPolls[msg.sender].push(pollCount);

        emit PollCreated(pollCount, msg.sender, _question, durationInSeconds, _options.length);
        return pollCount;
    }

    function vote(uint256 _pollId, uint256 _optionIndex) external payable {
        Poll storage poll = polls[_pollId];
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll");
        require(!poll.deleted, "Poll deleted");
        require(!poll.finalized, "Poll finalized");
        require(block.timestamp < poll.expiresAt, "Poll expired");
        require(!poll.hasVoted[msg.sender], "Already voted");
        require(_optionIndex < poll.options.length, "Invalid option");
        require(msg.value >= VOTE_COST, "Insufficient vote cost");

        poll.hasVoted[msg.sender] = true;
        poll.options[_optionIndex].votes++;
        poll.totalVotes++;
        poll.totalFunds += msg.value;

        emit VoteCast(_pollId, msg.sender, _optionIndex);
    }

    function finalizePoll(uint256 _pollId) external {
        Poll storage poll = polls[_pollId];
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll");
        require(!poll.deleted, "Poll deleted");
        require(!poll.finalized, "Already finalized");
        require(block.timestamp >= poll.expiresAt, "Poll not expired");

        poll.finalized = true;
        poll.finalizedAt = block.timestamp;

        uint256 winningIndex = 0;
        uint256 maxVotes = 0;

        for (uint256 i = 0; i < poll.options.length; i++) {
            if (poll.options[i].votes > maxVotes) {
                maxVotes = poll.options[i].votes;
                winningIndex = i;
            }
        }

        uint256 creatorPayout = 0;
        uint256 platformPayout = poll.totalFunds;

        if (poll.hasBet && winningIndex == poll.betOptionIndex) {
            creatorPayout = (poll.totalFunds * 90) / 100;
            platformPayout = poll.totalFunds - creatorPayout;

            if (creatorPayout > 0) {
                (bool successCreator, ) = poll.creator.call{value: creatorPayout}("");
                require(successCreator, "Creator payout failed");
            }
        }

        if (platformPayout > 0) {
            (bool successPlatform, ) = platformWallet.call{value: platformPayout}("");
            require(successPlatform, "Platform payout failed");
        }

        emit PollFinalized(_pollId, winningIndex, creatorPayout, platformPayout);
    }

    function deletePoll(uint256 _pollId) external {
        Poll storage poll = polls[_pollId];
        require(_pollId > 0 && _pollId <= pollCount, "Invalid poll");
        require(!poll.deleted, "Already deleted");
        require(poll.finalized, "Poll not finalized");
        require(block.timestamp >= poll.finalizedAt + CLEANUP_DELAY, "Cleanup delay not passed");

        poll.deleted = true;

        emit PollDeleted(_pollId);
    }

    function getCreatorBetOption(uint256 _pollId, address _requester) external view returns (uint256) {
        Poll storage poll = polls[_pollId];
        require(poll.creator == _requester, "Only creator can view bet");
        require(poll.hasBet, "Poll has no bet");
        return poll.betOptionIndex;
    }

    function getPoll(uint256 _pollId) external view returns (
        uint256 id,
        string memory question,
        address creator,
        uint256 createdAt,
        uint256 expiresAt,
        bool finalized,
        uint256 totalVotes,
        uint256 totalFunds,
        bool hasBet
    ) {
        Poll storage poll = polls[_pollId];
        return (
            poll.id,
            poll.question,
            poll.creator,
            poll.createdAt,
            poll.expiresAt,
            poll.finalized,
            poll.totalVotes,
            poll.totalFunds,
            poll.hasBet
        );
    }

    function getPollOptions(uint256 _pollId) external view returns (string[] memory, uint256[] memory) {
        Poll storage poll = polls[_pollId];
        string[] memory texts = new string[](poll.options.length);
        uint256[] memory votes = new uint256[](poll.options.length);

        for (uint256 i = 0; i < poll.options.length; i++) {
            texts[i] = poll.options[i].text;
            votes[i] = poll.options[i].votes;
        }

        return (texts, votes);
    }

    function hasVoted(uint256 _pollId, address _voter) external view returns (bool) {
        return polls[_pollId].hasVoted[_voter];
    }

    function getUserPolls(address _user) external view returns (uint256[] memory) {
        return userPolls[_user];
    }

    function getActivePolls(uint256 _limit) external view returns (uint256[] memory) {
        uint256[] memory activeIds = new uint256[](_limit);
        uint256 count = 0;

        for (uint256 i = pollCount; i > 0 && count < _limit; i--) {
            if (!polls[i].deleted && block.timestamp < polls[i].expiresAt && !polls[i].finalized) {
                activeIds[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeIds[i];
        }

        return result;
    }

    function getCompletedPolls(uint256 _limit) external view returns (uint256[] memory) {
        uint256[] memory completedIds = new uint256[](_limit);
        uint256 count = 0;

        for (uint256 i = pollCount; i > 0 && count < _limit; i--) {
            if (!polls[i].deleted && polls[i].finalized && block.timestamp < polls[i].finalizedAt + CLEANUP_DELAY) {
                completedIds[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = completedIds[i];
        }

        return result;
    }

    function getPollsReadyForCleanup() external view returns (uint256[] memory) {
        uint256[] memory cleanupIds = new uint256[](100);
        uint256 count = 0;

        for (uint256 i = pollCount; i > 0 && count < 100; i--) {
            if (!polls[i].deleted && polls[i].finalized && block.timestamp >= polls[i].finalizedAt + CLEANUP_DELAY) {
                cleanupIds[count] = i;
                count++;
            }
        }

        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = cleanupIds[i];
        }

        return result;
    }
}
