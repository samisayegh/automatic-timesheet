
export interface CommitInfo {
    author: string,
    id: string,
    timestamp: Date
}

export interface LogCommand {
    issueKey: string,
    logTime: TimeToLog
}

// Enum to restrict business rule by type: should be either four or eight hours, nothing outside of that.
enum TimeToLog {
    four,
    eight
}

/**
 *  
 */
// @ts-ignore
function calculateFromCommits(logDate: Date, commitInfos: CommitInfo[]) : LogCommand[] { 

    // iterate through commits in CommitInfo[]
    // for each commit c in CommitInfo
    // if it is in dateToLog, add to ListLog.

    // Calculate all records in ListLog, take the first two, and divide time of 8.
    return [];
}