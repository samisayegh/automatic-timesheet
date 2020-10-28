import {config} from 'dotenv';
import * as dayjs from 'dayjs';

import {getDateRange, format} from './date/date-range';
import {jiraClient} from './composition-root'
import { Issue, JiraClient } from './jira-client/jira-client';
import { LogCalculator } from './services/log-calculator';

config();

async function main() {
  const args = process.argv.slice(2);
  const start = args[0] || format(dayjs())
  const end = args[1] || start;
  
  const allDates = getDateRange(start, end);

  // Fetch the Issues

  // to be fixed to have many issues
  // @ts-ignore
  const issues = await jiraClient.getIssuesInProgress(dateStart, dateEnd);
  
  // Fetch Commits
  
  // transform the devtails to commit infos
  // const commits = (await devDetails).developmentInformation.details.instanceTypes[0].respository[0].commits;

  // log calculator
  const calculator = new LogCalculator();
  // @ts-ignore
  const logTimes = calculator.calculateFromCommitsRetroactive(allDates, commits);

  // log time
}

//@ts-ignore
async function getCommitsAndIssueKeys(issue: Issue, client: JiraClient) {
  const devDetails = await client.getDevDetailsForIssue(issue.id);

  return {
    issue,
    commits: devDetails.developmentInformation.details.instanceTypes[0].respository[0].commits
  }
}

main();
