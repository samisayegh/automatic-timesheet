import { Commit } from '../jira-client/jira-client'
import { LogCommand } from '../models/timesheet-models'

export class LogCalculator {
    // @ts-ignore
    public calculateFromCommits(logDate: Date, commitInfos: Commit[]) : LogCommand[] { 

        // iterate through commits in CommitInfo[]
        // for each commit c in CommitInfo
        // if it is in dateToLog, add to ListLog.

        // Calculate all records in ListLog, take the first two, and divide time of 8.
        return [];
    }
}
