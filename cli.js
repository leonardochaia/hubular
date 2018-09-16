#!/usr/bin/env node

'use strict'

require('dotenv').config();

const argv = require('yargs').argv

let hubular;
try {
  if (argv.config && argv.config.length) {
    hubular = require(argv.config);
  } else {
    hubular = require('app-root-path').require('./hubular.json');
  }
} catch (error) {
  console.error('Failed to find hubular.json.');
  throw error;
}

const hubotArgs = [];

for (const key in hubular.bot) {
  if (hubular.bot.hasOwnProperty(key)) {
    const value = hubular.bot[key];
    hubotArgs.push(`--${key}`);
    hubotArgs.push(value);
  }
}

const nodeArgs = [];
if (argv.debug) {
  nodeArgs.push('--inspect');
}

console.info(`Starting Hubot with args ${hubotArgs.join(' ')}`);

const child_process = require('child_process');
child_process.execFileSync("node", [
  ...nodeArgs,
  "./node_modules/hubot/bin/hubot.js",
  "--",
  ...hubotArgs
], {
  stdio: 'inherit'
});
