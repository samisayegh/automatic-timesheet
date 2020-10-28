// import { Commit } from '../jira-client/jira-client'
import { LogTimeInfo, LogCommand, CommitsForIssue, TimeToLog } from '../models/timesheet-models'

export class LogCalculator {
    
    /**
     * calculateFromCommits
     * This is the method covers the use-case of a single date
     * Input: the date to log and commits relative to this day
     * Output: the logTimeInfo
     */
    public calculateFromCommits(logDate: Date, commitsForIssues: CommitsForIssue[]) : LogTimeInfo { 

        var logDateToCompare = logDate.toDateString();

        var listLog: string[] = [];
        
        // iterate through commits in CommitInfo[]
        // for each commit c in CommitInfo
        // if it is in dateToLog, add to ListLog.
        commitsForIssues.forEach(commitInfo => {
            const jiraKey = commitInfo.issueKey;
            
            commitInfo.commits.forEach(commit => {
                var dateOfCommit = new Date(commit.timestamp).toDateString();
                console.log('date ofcommit: ' + dateOfCommit);
                console.log('date of logDateToCompare = ' + logDateToCompare)
                if(logDateToCompare === dateOfCommit) {
                    listLog.push(jiraKey);
                    console.log('ARE EQUAL');
                } else {
                    console.log('ARE DIFFERENT')
                }
            });
        });

        // Calculate all records in ListLog, take the first two, and divide time of 8.
        var logCommands: LogCommand[] = [];

        if(listLog.length === 0) {
            return {
                dateToLog: new Date(),
                logCommands: []
            };
        }

        if(listLog.length === 1) {
            var singleLogCommand: LogCommand = {
                issueKey: listLog[0],
                logTime: TimeToLog.eight
             };

            logCommands.push(singleLogCommand);
        }

        const result: LogTimeInfo = {
            dateToLog: logDate,
            logCommands
        };
        return result;
    }

    /**
     * calculateFromCommitsRetroactive
     * This is the method to wrap the use-case of multiple dates
     * Input: the retroactive dates to log and commits relative to those dates
     * Output: the logTimeInfos list, each one corresponding to one particular day to log
     */
    // @ts-ignore
    public calculateFromCommitsRetroactive(logDates: Date[], commitsForIssues: CommitsForIssue[]) : LogTimeInfo[] {

        // should iterate the dates and call the `calculateFromCommits` to get all the LogTimeInfos
    }
}
