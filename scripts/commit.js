// scripts/commit.js
const defaultGenerator = require("@changesets/cli/commit");

function removeSkipCI(message) {
  return message.replace(/\[skip ci]/g, "").trim();
}

exports.getAddMessage = () => {
  const defaultMessage = defaultGenerator.getAddMessage();
  return removeSkipCI(defaultMessage);
};

exports.getVersionMessage = () => {
  const defaultMessage = defaultGenerator.getVersionMessage();
  return removeSkipCI(defaultMessage);
};
