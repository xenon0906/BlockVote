const fs = require('fs');
const path = require('path');

const artifactPath = path.join(__dirname, '../artifacts/contracts/BlockVote.sol/BlockVote.json');
const outputPath = path.join(__dirname, '../utils/BlockVoteABI.json');

try {
  const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
  fs.writeFileSync(outputPath, JSON.stringify(artifact.abi, null, 2));
  console.log('ABI generated successfully at utils/BlockVoteABI.json');
} catch (error) {
  console.error('Error generating ABI:', error.message);
  process.exit(1);
}
