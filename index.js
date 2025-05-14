require('dotenv').config();
const _ = require('lodash');
const core = require('@actions/core');
const axios = require('axios');

function properCase(str) {
  return _.replace(
    _.toLower(str),
    /^\w|\s\w/g,
    (letter) => _.toUpper(letter)
  );
}

// most @actions toolkit packages have async methods
async function run() {
  try {
    const status = _.toLower(core.getInput('status'));

    const webhookUrl = core.getInput('slack_webhook_url');

    if (!webhookUrl) {
      throw new Error('slack_webhook_url input not specified. Did you remember to add it as a secret in your Github repo?');
    }

    const actor = process.env.GITHUB_ACTOR;
    const repo = process.env.GITHUB_REPOSITORY;
    const ref = process.env.GITHUB_REF;
    const branch = _.replace(ref, 'refs/heads/', '');

    const workflowId = process.env.GITHUB_RUN_ID;

    const repoUrl = `https://github.com/${repo}`;
    const workflowUrl = `${repoUrl}/actions/runs/${workflowId}`;
    const branchUrl = `${repoUrl}/tree/${branch}`;

    const message = `${properCase(status)}: ${actor}'s <${workflowUrl}|workflow> in <${repoUrl}|${repo}> (<${branchUrl}|${branch}>)`;

    const { data } = await axios({
      method: 'post',
      url: webhookUrl,
      data: {
        attachments: [
          {
            author_icon: `https://github.com/${actor}.png`,
            author_name: actor,
            color: status === 'success' ? '#2eb886' : '#f44336',
            fields: [
              {
                value: message,
              },
            ],
          },
        ],
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Accept: 'application/json',
      },
    });

    // Slack returns 200 even when failed
    if (data !== 'ok') {
      throw new Error(JSON.stringify(data));
    }

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
