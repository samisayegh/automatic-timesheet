// import { Commit } from '../jira-client/jira-client'
import { LogTimeInfo, LogCommand, CommitsForIssue, TimeToLog } from '../models/timesheet-models'

export class LogCalculator {

    private getUniqueIssueKeysForCurrentDate(logDate: Date, commitsForIssues: CommitsForIssue[]) {
        const logDateToCompare = logDate.toDateString();
        const listLog: string[] = [];

        commitsForIssues.forEach(commitInfo => {
            const jiraKey = commitInfo.issueKey;
            
            commitInfo.commits.forEach(commit => {
                const dateOfCommit = new Date(commit.timestamp).toDateString();
                
                if(logDateToCompare === dateOfCommit) {
                    listLog.push(jiraKey);
                }
            });
        });

        const uniqueIssueKeys = [...new Set(listLog)];
        return uniqueIssueKeys;
    }
    
    /**
     * calculateFromCommits
     * This is the method covers the use-case of a single date
     * Input: the date to log and commits relative to this day
     * Output: the logTimeInfo
     */
    public calculateFromCommits(logDate: Date, commitsForIssues: CommitsForIssue[]) : LogTimeInfo { 

        const uniqueIssueKeys = this.getUniqueIssueKeysForCurrentDate(logDate, commitsForIssues);

        const logCommands: LogCommand[] = [];

        if(uniqueIssueKeys.length === 0) {
            console.log('nothing here to log.');
            return {
                dateToLog: new Date(),
                logCommands: []
            };
        }

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
                issueKey: uniqueIssueKeys[1],
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
