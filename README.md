# Slack Github Action

Send a notification to the #builds channel from a Github action. Designed for notifications of successful or failed builds Slack.


## Usage

Add the following at the end of your deployment build workflow:

```yaml
- uses: beaconcrm/slack-github-action@master
  with:
    status: ${{ job.status }}
    slack_webhook_url: ${{ secrets.SLACK_WEBHOOK_URL }}
  if: always() # Run on fail/cancelled too
```

## Development

Make your changes, and then run `yarn build` to package the `dist/index.js` file, which is what is used at runtime by consumers.