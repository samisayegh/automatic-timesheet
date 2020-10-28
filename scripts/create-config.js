const {writeFileSync, existsSync} = require('fs');
const {resolve} = require('path');

const filePath = resolve(__dirname, '../.env');

if (existsSync(filePath)) {
  return;
}

const content = (
  `
TIMESHEET_JIRA_EMAIL=<your_email@coveo.com>
TIMESHEET_JIRA_API_KEY=<token from https://id.atlassian.com/manage-profile/security/api-tokens>
  `)


writeFileSync(filePath, content.trim())