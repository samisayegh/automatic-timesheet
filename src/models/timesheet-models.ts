export interface LogCommand {
    issueKey: string,
    logTime: TimeToLog
}

// Enum to restrict business rule by type: should be either four or eight hours, nothing outside of that.
enum TimeToLog {
    four,
    eight
}

// Todo: move other models here!