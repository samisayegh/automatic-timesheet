import {config} from 'dotenv';
import * as dayjs from 'dayjs';

import {format} from './date/date-range';
import {jiraClient} from './composition-root'
import { Issue, JiraClient, LogTimeProps } from './jira-client/jira-client';
import { LogCalculator } from './services/log-calculator';
import { CommitsForIssue, LogTimeInfo, TimeToLog } from './models/timesheet-models';

config();

async function main() {
  const args = process.argv.slice(2);
  const start = args[0] || format(dayjs(Date.now()))
  const end = args[1] || start;
  
  // const allDates = getDateRange(start, end);
  
  const startDate = dayjs(start).toDate();
  const endDate = dayjs(end).toDate();

  const res = await jiraClient.getIssuesInProgress(startDate, endDate);
  
  const promises = res.data.issues.map(issue => getCommitsAndIssueKeys(issue, jiraClient))
  const issuesAndCommits = await Promise.all(promises)

  const commitsForIssues: CommitsForIssue[] = issuesAndCommits.map(i => {
    const issueKey = i.issue.key;
    const commits = i.commits;

    return {issueKey, commits}
  });
  
  const calculator = new LogCalculator();
  const plan = calculator.calculateFromCommits(startDate, commitsForIssues);
  
  await executeLoggingPlan(plan, jiraClient);
}

async function getCommitsAndIssueKeys(issue: Issue, client: JiraClient) {
  const response = await client.getDevDetailsForIssue(issue.id);
  
  return {
    issue,
    commits: response.data.data.developmentInformation.details.instanceTypes[0].repository[0].commits
  }
}


async function executeLoggingPlan(plan: LogTimeInfo, client: JiraClient) {
  const {dateToLog, logCommands} = plan;

  const instructions: LogTimeProps[] = logCommands.map(c => {
    const {issueKey, logTime} = c;
    const hours = logTime === TimeToLog.eight ? 8 : 4;
    return {hours, issueKey, utc: dateToLog}
  })

  const promises = instructions.map(i => client.logTime(i));
  await Promise.all(promises);

  console.log('successfully logged');
}

main();
