import { Worklog } from '../jira-client/jira-client';

export function buildWorklog(config: Partial<Worklog> = {}): Worklog {
  return {
    id: '',
    issueId: '',
    started: '',
    timeSpentSeconds: 0,
    ...config
  }
}