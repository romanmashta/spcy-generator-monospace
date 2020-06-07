const SCOPE_NAME = 'spcy';
const GIT_USER = 'romanmashta';

module.exports = {
  packageName: {
    type: "input",
    message: "Specify package name",
  },
  scopeName: {
    type: "input",
    message: "Specify package scope name",
    default: SCOPE_NAME,
    store: true,
  },
  gitUser: {
    type: "input",
    message: "What's your GitHub username",
    default: GIT_USER,
    store: true,
  }
};
