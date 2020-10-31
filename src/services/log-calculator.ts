import { Commit } from '../jira-client/jira-client';
import { LogTimeInfo, LogCommand, IssueInfo, TimeToLog } from '../models/timesheet-models'

export class LogCalculator {

    private getActiveIssueKeysForDate(logDate: Date, commitsForIssues: IssueInfo[]) {
        const targetDate = logDate.toDateString();
        const issues = commitsForIssues.filter(commitInfo => this.hasCommitOnDate(commitInfo.commits, targetDate));
        return issues.map(issue => issue.issueKey);
    }

    private hasCommitOnDate(commits: Commit[], targetDate: string) {
        return !!commits.find(commit => this.commitIsOnDate(commit, targetDate))
    }

    private commitIsOnDate(commit: Commit, targetDate: string) {
        const commitDate = new Date(commit.timestamp).toDateString();
        return commitDate === targetDate;
    }
    
    /**
     * calculateFromCommits
     * This is the method covers the use-case of a single date
     * Input: the date to log and commits relative to this day
     * Output: the logTimeInfo
     */
    public calculateFromCommits(logDate: Date, commitsForIssues: IssueInfo[]) : LogTimeInfo { 

        const issueKeys = this.getActiveIssueKeysForDate(logDate, commitsForIssues);

        const logCommands: LogCommand[] = [];

        if(issueKeys.length === 0) {
            console.log('nothing here to log.');
            return {
                dateToLog: new Date(),
                logCommands: []
            };
        }

        if(issueKeys.length === 1) {
            const singleLogCommand: LogCommand = {
                issueKey: issueKeys[0],
                logTime: TimeToLog.eight
             };

            logCommands.push(singleLogCommand);
        } else if (issueKeys.length >= 2) {
            const firstIssue: LogCommand = {
                issueKey: issueKeys[0],
                logTime: TimeToLog.four
             };

            logCommands.push(firstIssue);

            const secondIssue: LogCommand = {
                issueKey: issueKeys[1],
                logTime: TimeToLog.four
             };
             logCommands.push(secondIssue);

            if (issueKeys.length > 2) {
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
    public calculateFromCommitsRetroactive(logDates: Date[], commitsForIssues: IssueInfo[]) : LogTimeInfo[] {

        // todo: validate Dates input, should no be duplicate!

        // should iterate the dates and call the `calculateFromCommits` to get all the LogTimeInfos
        const result: LogTimeInfo[] = [];

        [...new Set(logDates)].forEach(dateToLog => {
            const logTimeInfo: LogTimeInfo = this.calculateFromCommits(dateToLog, commitsForIssues);
            result.push(logTimeInfo);
        });

        return result; 
    }
}
