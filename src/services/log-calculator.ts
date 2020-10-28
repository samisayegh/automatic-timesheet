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

        const logDateToCompare = logDate.toDateString();

        const listLog: string[] = [];
        
        // iterate through commits in CommitInfo[]
        // for each commit c in CommitInfo
        // if it is in dateToLog, add to ListLog.
        commitsForIssues.forEach(commitInfo => {
            const jiraKey = commitInfo.issueKey;
            
            commitInfo.commits.forEach(commit => {
                const dateOfCommit = new Date(commit.timestamp).toDateString();
                console.log('date ofcommit: ' + dateOfCommit);
                console.log('date of logDateToCompare = ' + logDateToCompare)
                if(logDateToCompare === dateOfCommit && !listLog.includes(jiraKey)) {
                    listLog.push(jiraKey);
                    console.log('Adding to listLog');
                } else {
                    if(listLog.includes(jiraKey)) {
                        console.log('issue key is already inclued :' + jiraKey);
                    } else {
                        console.log('ARE DIFFERENT');
                    }
                }
            });
        });
        const uniqueIssueKeys = [...new Set(listLog)];

        // Calculate all records in ListLog, take the first two, and divide time of 8.
        const logCommands: LogCommand[] = [];

        if(listLog.length === 0) {
            return {
                dateToLog: new Date(),
                logCommands: []
            };
        }

        // todo: clean up listLog for single values

        if(uniqueIssueKeys.length === 1) {
            const singleLogCommand: LogCommand = {
                issueKey: uniqueIssueKeys[0],
                logTime: TimeToLog.eight
             };

            logCommands.push(singleLogCommand);
        } else if (uniqueIssueKeys.length >= 2) {
            const firstIssue: LogCommand = {
                issueKey: uniqueIssueKeys[0],
                logTime: TimeToLog.four
             };

            logCommands.push(firstIssue);

            const secondIssue: LogCommand = {
                issueKey: listLog[1],
                logTime: TimeToLog.four
             };
             logCommands.push(secondIssue);

            if (uniqueIssueKeys.length > 2) {
                console.log("Detected more than two issues, but only the first two are being logged.");
                // todo: log discarded issues for user information.
            }
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
