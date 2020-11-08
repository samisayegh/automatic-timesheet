import {config} from 'dotenv';
import * as dayjs from 'dayjs';

import {format, getDateRange} from './date/date-range';
import {jiraClient} from './composition-root'
import { Issue, JiraClient, LogTimeProps } from './jira-client/jira-client';
import { LogCalculator, LogPlan } from './log-calculator/log-calculator';
import { IssueInfo} from './models/timesheet-models';

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
  const work = await getWorkBetween(startDate, endDate, jiraClient);
  const worklogs = await jiraClient.getWorkLogs(startDate, endDate);

  dateRange.forEach(async dateString => {
    const targetDate = dayjs(dateString).toDate();
    const calculator = new LogCalculator();
    const plan = calculator.calculateLogPlan(targetDate, work, worklogs);
    
    console.log('Logging time for:', dateString)
    await executeLoggingPlan(plan, jiraClient);
  })

  console.log('done');
}

async function getWorkBetween(start: Date, end: Date, client: JiraClient) {
  const issues = await client.getIssuesInProgress(start, end);
  const promises = issues.map(issue => fetchIssueInfo(issue, jiraClient))
  return await Promise.all(promises);
}

async function fetchIssueInfo(issue: Issue, client: JiraClient): Promise<IssueInfo> {
  const response = await client.getDevDetailsForIssue(issue.id);
  
  return {
    issueKey: issue.key,
    commits: response.data.data.developmentInformation.details.instanceTypes[0].repository[0].commits
  }
}


async function executeLoggingPlan(plan: LogPlan, client: JiraClient) {
  const {logDate, logCommands} = plan;

  const instructions: LogTimeProps[] = logCommands.map(command => {
    const {issueKey, seconds} = command;
    return {issueKey, seconds, utc: logDate}
  })

  const promises = instructions.map(i => client.logTime(i));
  await Promise.all(promises);
}

main();
