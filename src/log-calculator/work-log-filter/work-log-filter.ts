import * as dayjs from 'dayjs';
import {Worklog, WorklogIssue} from '../../jira-client/jira-client'

export function getWorklogIssuesForDate(date: Date, worklogIssues: WorklogIssue[]) {
  const targetDateString = date.toDateString();

  return worklogIssues
  .map(issue => onlyKeepWorklogsWithDate(issue, targetDateString))
  .filter(issue => issue.worklogs.length);
}

function onlyKeepWorklogsWithDate(issue: WorklogIssue, targetDate: string): WorklogIssue {
  const worklogs = issue.worklogs.filter(worklog => worklogIsOnDate(worklog, targetDate))
  return {...issue, worklogs}
}

function worklogIsOnDate(worklog: Worklog, targetDate: string) {
  const worklogDate = dayjs(worklog.started).toDate().toDateString();
  return worklogDate === targetDate;
}