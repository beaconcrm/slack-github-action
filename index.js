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

    const message = `Success: ${actor}'s <${workflowUrl}|workflow> in <${repoUrl}|${repo}> (<${branchUrl}|${branch}>)`;

    const { data } = await axios({
      method: 'post',
      url: process.env.SLACK_WEBHOOK_URL,
      data: {
        attachments: [
          {
            color: '#2eb886',
            fields: [
              {
                // title: 'Number of customers',
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


    // Success: cjhoughton's workflow (workflow) in beacon-apps/csv-service (development)
    // - Merged in f/row-number-max-50k (pull request #152) (1576eb3)

    // const ms = core.getInput('milliseconds');
    // console.log(`Waiting ${ms} milliseconds ...`);
    // console.log('env variables are below:');
    // console.log(process.env);

    // core.debug((new Date()).toTimeString());
    // await wait(parseInt(ms));
    // core.debug((new Date()).toTimeString());

    core.setOutput('time', new Date().toTimeString());
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
