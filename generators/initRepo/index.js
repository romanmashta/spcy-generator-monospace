'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');

const SPACE_ROOT = 'spc';
const SCOPE_NAME = 'spcy';
const GIT_USER = 'romanmashta';

module.exports = class extends Generator {
  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(`Welcome to the perfect ${chalk.red('generator-monospace')} generator!`)
    );

    const prompts = [
      {
        type: "input",
        name: "packageName",
        message: "Specify package name",
      }
      ,{
        type: "input",
        name: "scopeName",
        message: "Specify package scope name",
        default: SCOPE_NAME,
        store: true,
      }
      ,{
        type: "input",
        name: "gitUser",
        message: "What's your GitHub username",
        default: GIT_USER,
        store: true,
      }
    ];

    return this.prompt(prompts).then(props => {
      this.props = props;
    });
  }

  app() {
    const elements = this.props.packageName.split('-');
    this.destinationRoot(path.join(...[SPACE_ROOT, ...elements]));
  }

  writing() {
    this.fs.copy(
      this.templatePath('.*'),
      this.destinationRoot()
    );
  }

  install() {
    const repoName = `${this.props.scopeName}-${this.props.packageName}`;
    const gitRepoName = `${this.props.gitUser}/${repoName}`;
    const scopedPackageName = `@${this.props.scopeName}/${this.props.packageName}`;
    const repo = `git@github.com:${gitRepoName}.git`;

    this.log('Destination root:', this.destinationRoot());
    this.log('Git Repository Name:', gitRepoName);
    this.log('Package Name:', scopedPackageName);

    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['remote', 'add', 'origin', repo]);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '-m', `"Initial commit for ${repoName}"`]);
  }
};
