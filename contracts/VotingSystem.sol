// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title VotingSystem
 * @dev Advanced blockchain voting system with polls, candidates, and rewards
 */
contract VotingSystem {

    // Structs
    struct Candidate {
        address candidateAddress;
        string name;
        uint256 voteCount;
        bool exists;
    }

    struct Poll {
        uint256 id;
        string title;
        string description;
        address creator;
        uint256 createdAt;
        uint256 duration;
        uint256 endTime;
        uint256 maxCandidates;
        uint256 votingFee;
        uint256 totalVotes;
        uint256 totalInteractions;
        uint256 candidateCount;
        bool isActive;
        bool isDeleted;
        uint256 completedAt;
        address winner;
        uint256 totalRewardPool;
    }

    // State variables
    uint256 public pollCount;
    uint256 public constant PLATFORM_FEE_PERCENT = 10;
    uint256 public constant WINNER_REWARD_PERCENT = 90;
    address public immutable owner;
    uint256 public totalPlatformFees;

    // Mappings
    mapping(uint256 => Poll) public polls;
    mapping(uint256 => mapping(uint256 => Candidate)) public pollCandidates;
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => mapping(address => uint256)) public voterPayments;
    mapping(address => uint256) public userTotalVotes;
    mapping(address => uint256) public userTotalRewardsWon;

    // Events
    event PollCreated(
        uint256 indexed pollId,
        string title,
        address indexed creator,
        uint256 duration,
        uint256 maxCandidates,
        uint256 votingFee
    );

    event CandidateAdded(
        uint256 indexed pollId,
        uint256 candidateIndex,
        address indexed candidateAddress,
        string name
    );

    event CandidateReplaced(
        uint256 indexed pollId,
        uint256 candidateIndex,
        address indexed oldCandidate,
        address indexed newCandidate,
        uint256 payment
    );

    event VoteCast(
        uint256 indexed pollId,
        address indexed voter,
        uint256 candidateIndex,
        uint256 fee
    );

    event PollEnded(
        uint256 indexed pollId,
        address indexed winner,
        uint256 rewardAmount
    );

    event PollDeleted(
        uint256 indexed pollId,
        address indexed creator
    );

    event RefundIssued(
        uint256 indexed pollId,
        address indexed voter,
        uint256 amount
    );

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }

    modifier pollExists(uint256 _pollId) {
        require(_pollId < pollCount, "Poll does not exist");
        _;
    }

    modifier pollActive(uint256 _pollId) {
        require(polls[_pollId].isActive, "Poll is not active");
        require(!polls[_pollId].isDeleted, "Poll has been deleted");
        require(block.timestamp < polls[_pollId].endTime, "Poll has ended");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    /**
     * @dev Create a new poll
     */
    function createPoll(
        string memory _title,
        string memory _description,
        uint256 _durationInDays,
        uint256 _maxCandidates,
        uint256 _votingFee
    ) external returns (uint256) {
        require(_maxCandidates > 0, "Must allow at least 1 candidate");
        require(_durationInDays > 0, "Duration must be greater than 0");
        require(_votingFee > 0, "Voting fee must be greater than 0");

        uint256 pollId = pollCount++;
        uint256 duration = _durationInDays * 1 days;
        uint256 endTime = block.timestamp + duration;

        polls[pollId] = Poll({
            id: pollId,
            title: _title,
            description: _description,
            creator: msg.sender,
            createdAt: block.timestamp,
            duration: duration,
            endTime: endTime,
            maxCandidates: _maxCandidates,
            votingFee: _votingFee,
            totalVotes: 0,
            totalInteractions: 0,
            candidateCount: 0,
            isActive: true,
            isDeleted: false,
            completedAt: 0,
            winner: address(0),
            totalRewardPool: 0
        });

        emit PollCreated(pollId, _title, msg.sender, duration, _maxCandidates, _votingFee);

        return pollId;
    }

    /**
     * @dev Add a candidate to a poll
     */
    function addCandidate(
        uint256 _pollId,
        string memory _name
    ) external pollExists(_pollId) pollActive(_pollId) {
        Poll storage poll = polls[_pollId];
        require(poll.candidateCount < poll.maxCandidates, "Maximum candidates reached");

        uint256 candidateIndex = poll.candidateCount++;

        pollCandidates[_pollId][candidateIndex] = Candidate({
            candidateAddress: msg.sender,
            name: _name,
            voteCount: 0,
            exists: true
        });

        poll.totalInteractions++;

        emit CandidateAdded(_pollId, candidateIndex, msg.sender, _name);
    }

    /**
     * @dev Replace an existing candidate by paying them
     */
    function replaceCandidate(
        uint256 _pollId,
        uint256 _candidateIndex,
        string memory _name
    ) external payable pollExists(_pollId) pollActive(_pollId) {
        Poll storage poll = polls[_pollId];
        require(_candidateIndex < poll.candidateCount, "Invalid candidate index");

        Candidate storage existingCandidate = pollCandidates[_pollId][_candidateIndex];
        require(existingCandidate.exists, "Candidate does not exist");
        require(msg.value > 0, "Must pay to replace candidate");

        address oldCandidate = existingCandidate.candidateAddress;

        // Transfer payment to the existing candidate
        (bool success, ) = payable(oldCandidate).call{value: msg.value}("");
        require(success, "Payment to candidate failed");

        // Replace the candidate
        existingCandidate.candidateAddress = msg.sender;
        existingCandidate.name = _name;
        existingCandidate.voteCount = 0;

        poll.totalInteractions++;

        emit CandidateReplaced(_pollId, _candidateIndex, oldCandidate, msg.sender, msg.value);
    }

    /**
     * @dev Cast a vote for a candidate
     */
    function vote(
        uint256 _pollId,
        uint256 _candidateIndex
    ) external payable pollExists(_pollId) pollActive(_pollId) {
        Poll storage poll = polls[_pollId];
        require(msg.value == poll.votingFee, "Incorrect voting fee");
        require(!hasVoted[_pollId][msg.sender], "Already voted in this poll");
        require(_candidateIndex < poll.candidateCount, "Invalid candidate index");

        Candidate storage candidate = pollCandidates[_pollId][_candidateIndex];
        require(candidate.exists, "Candidate does not exist");

        // Record the vote
        hasVoted[_pollId][msg.sender] = true;
        voterPayments[_pollId][msg.sender] = msg.value;
        candidate.voteCount++;
        poll.totalVotes++;
        poll.totalInteractions++;
        poll.totalRewardPool += msg.value;

        // Update user stats
        userTotalVotes[msg.sender]++;

        emit VoteCast(_pollId, msg.sender, _candidateIndex, msg.value);
    }

    /**
     * @dev End a poll and distribute rewards
     */
    function endPoll(uint256 _pollId) external pollExists(_pollId) {
        Poll storage poll = polls[_pollId];
        require(poll.isActive, "Poll is not active");
        require(!poll.isDeleted, "Poll has been deleted");
        require(block.timestamp >= poll.endTime, "Poll has not ended yet");

        poll.isActive = false;
        poll.completedAt = block.timestamp;

        // Find winner (candidate with most votes)
        uint256 maxVotes = 0;
        address winnerAddress = address(0);

        for (uint256 i = 0; i < poll.candidateCount; i++) {
            Candidate storage candidate = pollCandidates[_pollId][i];
            if (candidate.voteCount > maxVotes) {
                maxVotes = candidate.voteCount;
                winnerAddress = candidate.candidateAddress;
            }
        }

        poll.winner = winnerAddress;

        // Distribute rewards if there are votes
        if (poll.totalRewardPool > 0 && winnerAddress != address(0)) {
            uint256 platformFee = (poll.totalRewardPool * PLATFORM_FEE_PERCENT) / 100;
            uint256 winnerReward = poll.totalRewardPool - platformFee;

            totalPlatformFees += platformFee;
            userTotalRewardsWon[winnerAddress] += winnerReward;

            // Transfer reward to winner
            (bool success, ) = payable(winnerAddress).call{value: winnerReward}("");
            require(success, "Reward transfer failed");

            emit PollEnded(_pollId, winnerAddress, winnerReward);
        }
    }

    /**
     * @dev Delete a poll and refund all voters
     */
    function deletePoll(uint256 _pollId) external pollExists(_pollId) {
        Poll storage poll = polls[_pollId];
        require(msg.sender == poll.creator || msg.sender == owner, "Not authorized");
        require(poll.isActive, "Poll is not active");
        require(!poll.isDeleted, "Poll already deleted");

        poll.isDeleted = true;
        poll.isActive = false;

        emit PollDeleted(_pollId, poll.creator);
    }

    /**
     * @dev Claim refund for a deleted poll
     */
    function claimRefund(uint256 _pollId) external pollExists(_pollId) {
        Poll storage poll = polls[_pollId];
        require(poll.isDeleted, "Poll is not deleted");
        require(hasVoted[_pollId][msg.sender], "Did not vote in this poll");
        require(voterPayments[_pollId][msg.sender] > 0, "Already refunded");

        uint256 refundAmount = voterPayments[_pollId][msg.sender];
        voterPayments[_pollId][msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: refundAmount}("");
        require(success, "Refund failed");

        emit RefundIssued(_pollId, msg.sender, refundAmount);
    }

    /**
     * @dev Get poll details
     */
    function getPoll(uint256 _pollId) external view pollExists(_pollId) returns (Poll memory) {
        return polls[_pollId];
    }

    /**
     * @dev Get candidate details
     */
    function getCandidate(uint256 _pollId, uint256 _candidateIndex)
        external
        view
        pollExists(_pollId)
        returns (Candidate memory)
    {
        return pollCandidates[_pollId][_candidateIndex];
    }

    /**
     * @dev Get all candidates for a poll
     */
    function getAllCandidates(uint256 _pollId)
        external
        view
        pollExists(_pollId)
        returns (Candidate[] memory)
    {
        Poll storage poll = polls[_pollId];
        Candidate[] memory candidates = new Candidate[](poll.candidateCount);

        for (uint256 i = 0; i < poll.candidateCount; i++) {
            candidates[i] = pollCandidates[_pollId][i];
        }

        return candidates;
    }

    /**
     * @dev Get active polls
     */
    function getActivePolls() external view returns (uint256[] memory) {
        uint256 activeCount = 0;

        // Count active polls
        for (uint256 i = 0; i < pollCount; i++) {
            if (polls[i].isActive && !polls[i].isDeleted && block.timestamp < polls[i].endTime) {
                activeCount++;
            }
        }

        // Create array of active poll IDs
        uint256[] memory activePolls = new uint256[](activeCount);
        uint256 index = 0;

        for (uint256 i = 0; i < pollCount; i++) {
            if (polls[i].isActive && !polls[i].isDeleted && block.timestamp < polls[i].endTime) {
                activePolls[index] = i;
                index++;
            }
        }

        return activePolls;
    }

    /**
     * @dev Get completed polls (within last 24 hours)
     */
    function getCompletedPolls() external view returns (uint256[] memory) {
        uint256 completedCount = 0;
        uint256 cutoffTime = block.timestamp - 24 hours;

        // Count completed polls within 24 hours
        for (uint256 i = 0; i < pollCount; i++) {
            if (!polls[i].isActive && !polls[i].isDeleted && polls[i].completedAt > cutoffTime) {
                completedCount++;
            }
        }

        // Create array of completed poll IDs
        uint256[] memory completedPolls = new uint256[](completedCount);
        uint256 index = 0;

        for (uint256 i = 0; i < pollCount; i++) {
            if (!polls[i].isActive && !polls[i].isDeleted && polls[i].completedAt > cutoffTime) {
                completedPolls[index] = i;
                index++;
            }
        }

        return completedPolls;
    }

    /**
     * @dev Get trending polls (top 3 by interactions)
     */
    function getTrendingPolls() external view returns (uint256[] memory) {
        uint256[] memory trendingPolls = new uint256[](3);
        uint256[] memory interactions = new uint256[](3);

        for (uint256 i = 0; i < pollCount; i++) {
            if (polls[i].isActive && !polls[i].isDeleted && block.timestamp < polls[i].endTime) {
                uint256 pollInteractions = polls[i].totalInteractions;

                // Check if this poll should be in top 3
                for (uint256 j = 0; j < 3; j++) {
                    if (pollInteractions > interactions[j]) {
                        // Shift lower rankings down
                        for (uint256 k = 2; k > j; k--) {
                            interactions[k] = interactions[k-1];
                            trendingPolls[k] = trendingPolls[k-1];
                        }

                        interactions[j] = pollInteractions;
                        trendingPolls[j] = i;
                        break;
                    }
                }
            }
        }

        return trendingPolls;
    }

    /**
     * @dev Get user voting stats
     */
    function getUserStats(address _user) external view returns (
        uint256 totalVotes,
        uint256 totalRewards
    ) {
        return (userTotalVotes[_user], userTotalRewardsWon[_user]);
    }

    /**
     * @dev Withdraw platform fees (owner only)
     */
    function withdrawPlatformFees() external onlyOwner {
        uint256 amount = totalPlatformFees;
        require(amount > 0, "No fees to withdraw");

        totalPlatformFees = 0;

        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get total stats
     */
    function getTotalStats() external view returns (
        uint256 totalPolls,
        uint256 totalActivePolls,
        uint256 totalCompletedPolls,
        uint256 totalVotesGlobal
    ) {
        uint256 activeCount = 0;
        uint256 completedCount = 0;
        uint256 totalVotesCount = 0;

        for (uint256 i = 0; i < pollCount; i++) {
            if (!polls[i].isDeleted) {
                totalVotesCount += polls[i].totalVotes;

                if (polls[i].isActive && block.timestamp < polls[i].endTime) {
                    activeCount++;
                } else if (!polls[i].isActive && polls[i].completedAt > 0) {
                    completedCount++;
                }
            }
        }

        return (pollCount, activeCount, completedCount, totalVotesCount);
    }
}
