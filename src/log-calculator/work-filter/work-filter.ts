import * as dayjs from 'dayjs';
import { Commit } from '../../jira-client/jira-client';
import { IssueInfo } from '../../models/timesheet-models';

export function getActiveIssueKeysForDate(logDate: Date, commitsForIssues: IssueInfo[]) {
  const targetDate = logDate.toDateString();
  const issues = commitsForIssues.filter(commitInfo => hasCommitOnDate(commitInfo.commits, targetDate));
  return issues.map(issue => issue.issueKey);
}

function hasCommitOnDate(commits: Commit[], targetDate: string) {
  return !!commits.find(commit => commitIsOnDate(commit, targetDate))
}

function commitIsOnDate(commit: Commit, targetDate: string) {
  const commitDate = dayjs(commit.timestamp).toDate().toDateString();
  return commitDate === targetDate;
}