require('dotenv').config();
const _ = require('lodash');
const core = require('@actions/core');
const axios = require('axios');


// most @actions toolkit packages have async methods
async function run() {
  try {

    const actor = process.env.GITHUB_ACTOR;
    const repo = process.env.GITHUB_REPOSITORY;
    const ref = process.env.GITHUB_REF;
    const branch = _.last(_.split(ref, '/'));
    const workflowId = process.env.GITHUB_RUN_ID;

    const repoUrl = `https://github.com/${repo}`;
    const workflowUrl = `${repoUrl}/actions/runs/${workflowId}`;
    const branchUrl = `${repoUrl}/tree/${branch}`;

    const status = core.getInput('status');

    const message = `${status}: ${actor}'s <${workflowUrl}|workflow> in <${repoUrl}|${repo}> (<${branchUrl}|${branch}>)`;


    const { data } = await axios({
      method: 'post',
      url: process.env.SLACK_WEBHOOK_URL,
      data: {
        attachments: [
          {
            author_icon: `https://github.com/${actor}.png`,
            author_name: actor,
            color: status === 'Success' ? '#2eb886' : '#f44336',
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
