'use strict';
require('dotenv').config()
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const questions = require('./questions');
const {fromQuestions, repoProps} = require('../../utils');
const { Octokit } = require("@octokit/rest");
const octokit = new Octokit({
  auth: process.env.GIT_TOKEN
});

module.exports = class extends Generator {
  preRun(){
    this.props._rootDir = this.props._rootDir || this.env.cwd;
    console.log('root-path', this.props._rootDir);
  }

  prompting() {
    const prompts = fromQuestions(this, questions);

    return this.prompt(prompts).then(props => {
      const derived = {...props, ...this.options};
      this.props = {
        ...derived,
        repo: repoProps(derived)
      };
    });
  }

  app() {
    const {repo, _rootDir} = this.props;
    this.destinationRoot(path.join(_rootDir, repo.packageRoot));
  }

  writing() {
    this.log('writing rep');
    this.fs.copy(
      this.templatePath('.*'),
      this.destinationRoot()
    );
  }

  async _initGit() {
    const {repo} = this.props;

    this.log('Repo props:', repo);

    const rootScope = {cwd: this.props._rootDir}
    this.log('Creating git repository', repo);
    await octokit.repos.createForAuthenticatedUser({name: repo.projectName});
    this.log('Done');

    this.spawnCommandSync('git', ['init']);
    this.spawnCommandSync('git', ['remote', 'add', 'origin', repo.githubRepo]);
    this.spawnCommandSync('git', ['add', '--all']);
    this.spawnCommandSync('git', ['commit', '-m', `Init repository for ${repo.projectName}`]);
    this.spawnCommandSync('git', ['submodule', 'add', repo.githubRepo, repo.packageRoot], rootScope);
    this.spawnCommandSync('git', ['push', 'origin', 'master']);
  }

  async install() {
    await this._initGit();
  }
};
