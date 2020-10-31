import {config} from 'dotenv';
import * as dayjs from 'dayjs';

import {format, getDateRange} from './date/date-range';
import {jiraClient} from './composition-root'
import { Issue, JiraClient, LogTimeProps } from './jira-client/jira-client';
import { LogCalculator } from './services/log-calculator';
import { IssueInfo, LogTimeInfo, TimeToLog } from './models/timesheet-models';

config();

async function main() {
  const args = process.argv.slice(2);
  const start = args[0] || format(dayjs(Date.now()))
  const end = args[1] || start;
  const dateRange = getDateRange(start, end);

  if (!dateRange.length) {
    return;
  }

  const startDate = dayjs(start).toDate();
  const endDate = dayjs(end).toDate();
  const issues = await getIssuesBetween(startDate, endDate, jiraClient);
  
  dateRange.forEach(async dateString => {
    const targetDate = dayjs(dateString).toDate();
    const calculator = new LogCalculator();
    const plan = calculator.calculateFromCommits(targetDate, issues);
    
    console.log('Logging time for:', dateString)
    await executeLoggingPlan(plan, jiraClient);
  })
}

async function getIssuesBetween(start: Date, end: Date, client: JiraClient) {
  const res = await client.getIssuesInProgress(start, end);
  const promises = res.data.issues.map(issue => fetchIssueInfo(issue, jiraClient))
  return await Promise.all(promises);
}

async function fetchIssueInfo(issue: Issue, client: JiraClient): Promise<IssueInfo> {
  const response = await client.getDevDetailsForIssue(issue.id);
  
  return {
    issueKey: issue.key,
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

  console.log('complete');
}

main();
