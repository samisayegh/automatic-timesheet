import { Commit } from '../jira-client/jira-client'

export interface IssueInfo {
    issueKey: string,
    commits: Commit[]
}
// Todo: move other models here!