import { IssueInfo } from '../models/timesheet-models';

export function buildIssueInfo(config: Partial<IssueInfo> = {}): IssueInfo {
  return {
    issueKey: '',
    commits: [],
    ...config
  }
}