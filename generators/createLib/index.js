'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const path = require('path');
const initRepoQuestions = require('../initRepo/questions');
const {fromQuestions, repoProps} = require('../../utils');

const LIB_ROOT = 'lib';

module.exports = class extends Generator {
  preRun(){
    this.props._rootDir = this.props._rootDir || this.env.cwd;
    console.log('root-path', this.props._rootDir);
  }

  prompting() {
    this.log(
      yosay(`Welcome to the perfect ${chalk.red('generator-monospace')} generator!`)
    );

    const prompt = {
      appName: {
        type: "input",
        message: "Specify library name",
      }
    };

    const {scopeName, gitUser} = initRepoQuestions;
    const prompts = fromQuestions(this, {...prompt, scopeName, gitUser});

    return this.prompt(prompts).then(props => {
      const derived = {
        ...props,
        packageName: `${LIB_ROOT}.${props.appName}`,
      };
      this.props = {
        ...derived,
        repo: repoProps(derived)
      };
    });
  }

  default() {
    this.composeWith(require.resolve('../initRepo'), {
      ...this.props,
      skipRoot: true,
    });
  }

  app() {
    const {repo, _rootDir} = this.props;
    this.destinationRoot(path.join(_rootDir, repo.packageRoot));
  }

  writing() {
    const {repo} = this.props;
    this.fs.copy(
      this.templatePath('static/**/*'),
      this.destinationRoot()
    );
    this.fs.copy(
      this.templatePath('static/**/.*'),
      this.destinationRoot()
    );
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      { repo: repo }
    );
  }

  async install() {
    const {_rootDir} = this.props;
    const rootScope = {cwd: _rootDir}

    this.spawnCommandSync('yarn', [], rootScope);
  }
};
