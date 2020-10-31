import { WorklogResponse } from '../jira-client/jira-client';

export function buildWorklogResponse(config: Partial<WorklogResponse> = {}): WorklogResponse {
  return {
    issues: [],
    total: 0,
    ...config
  }
}