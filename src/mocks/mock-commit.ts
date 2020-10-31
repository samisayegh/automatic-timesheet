import { Commit } from "../jira-client/jira-client";

export function buildCommit(config: Partial<Commit> = {}): Commit {
  return {
    author: {
      name: ''
    },
    id: '',
    timestamp: '',
    ...config
  }
}