import { WorklogIssue } from '../jira-client/jira-client';
import { IssueInfo } from '../models/timesheet-models'
import { generatePlan, LogCommand } from './planner/planner';
import { getActiveIssueKeysForDate } from './work-filter/work-filter';
import { getWorklogIssuesForDate } from './work-log-filter/work-log-filter';

// This is what is needed to log a time
export interface LogPlan {
  logDate: Date,
  logCommands: LogCommand[]
}

export class LogCalculator {
  public calculateLogPlan(logDate: Date, commitsForIssues: IssueInfo[], worklogIssues: WorklogIssue[]): LogPlan {
    const issueKeys = getActiveIssueKeysForDate(logDate, commitsForIssues);
    const issuesWithLoggedTime = getWorklogIssuesForDate(logDate, worklogIssues);
    const logCommands = generatePlan(issueKeys, issuesWithLoggedTime);

    return { logDate, logCommands }
  }
}
