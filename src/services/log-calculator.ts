import { Commit } from '../jira-client/jira-client'
import { LogTimeInfo } from '../models/timesheet-models'

export class LogCalculator {
    
    /**
     * calculateFromCommits
     * This is the method covers the use-case of a single date
     * Input: the date to log and commits relative to this day
     * Output: the logTimeInfo
     */
    // @ts-ignore
    public calculateFromCommits(logDate: Date, commitInfos: Commit[]) : LogTimeInfo { 

        // iterate through commits in CommitInfo[]
        // for each commit c in CommitInfo
        // if it is in dateToLog, add to ListLog.

        // Calculate all records in ListLog, take the first two, and divide time of 8.
        return null;
    }

    /**
     * calculateFromCommitsRetroactive
     * This is the method to wrap the use-case of multiple dates
     * Input: the retroactive dates to log and commits relative to those dates
     * Output: the logTimeInfos list, each one corresponding to one particular day to log
     */
    // @ts-ignore
    public calculateFromCommitsRetroactive(logDates: Date[], commitInfos: Commit[]) : LogTimeInfo[] {

        // should iterate the dates and call the `calculateFromCommits` to get all the LogTimeInfos
    }
}
