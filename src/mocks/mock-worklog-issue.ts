import { WorklogIssue } from '../jira-client/jira-client';

export function buildWorklogIssue(config: Partial<WorklogIssue> = {}): WorklogIssue {
  return {
    id: '',
    key: '',
    worklogs: [],
    ...config
  }
}