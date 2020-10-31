import { Commit } from '../jira-client/jira-client'

export interface LogCommand {
    issueKey: string,
    logTime: TimeToLog
}

// Enum to restrict business rule by type: should be either four or eight hours, nothing outside of that.
export enum TimeToLog {
    four,
    eight
}

// This is what is needed to log a time
export interface LogTimeInfo {
    dateToLog: Date,
    logCommands: LogCommand[]
}

export interface IssueInfo {
    issueKey: string,
    commits: Commit[]
}
// Todo: move other models here!