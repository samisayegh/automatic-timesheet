import { WorklogIssue } from '../jira-client/jira-client';
import { IssueInfo } from '../models/timesheet-models'
import { generatePlan, Plan } from './planner/planner';
import { getActiveIssueKeysForDate } from './work-filter/work-filter';
import { getWorklogIssuesForDate } from './work-log-filter/work-log-filter';

export interface LogPlan {
  logDate: Date;
  plan: Plan;
}

export class LogCalculator {
  public calculateLogPlan(logDate: Date, commitsForIssues: IssueInfo[], worklogIssues: WorklogIssue[]): LogPlan {
    const issueKeys = getActiveIssueKeysForDate(logDate, commitsForIssues);
    const issuesWithLoggedTime = getWorklogIssuesForDate(logDate, worklogIssues);
    const plan = generatePlan(issueKeys, issuesWithLoggedTime);

    return { logDate, plan }
  }
}
