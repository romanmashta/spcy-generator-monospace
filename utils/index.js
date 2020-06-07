const _ = require('lodash');
const path = require('path');

const SPACE_ROOT = 'spcy';

const fromQuestions = (_this, pr) => _.map(pr, (p, k) => ({name: k, ...p, when: () => !_this.options[k]}));

const repoProps = (props) => (c = {
    packageRoot: path.join(...[SPACE_ROOT, ...props.packageName.split('.')]),
    ownerName: props.gitUser,
    scopedPackageName: `@${props.scopeName}/${props.packageName}`,
    projectName: `${props.scopeName}.${props.packageName}`,
  }, c = {
    ...c,
    gitRepoName: `${c.ownerName}/${c.projectName}`,
  }, {
    ...c,
    githubRepo: `git@github.com:${c.gitRepoName}.git`,
  }
);

module.exports = {
  fromQuestions,
  repoProps
}
