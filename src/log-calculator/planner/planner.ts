import { Worklog, WorklogIssue } from '../../jira-client/jira-client';

export interface Plan {
  logCommands: LogCommand[],
  message: string;
}

export interface LogCommand {
  issueKey: string,
  seconds: number
}
const hour = 3600;

// no issues
// logging x hours
// already 8 hours logged
// more than 8 hours logged

export function generatePlan(issueKeys: string[], issuesWithLoggedTime: WorklogIssue[]) {
  const secondsToLog = calculateSecondsToLog(issuesWithLoggedTime);
  const issueTimes = calculateTimePerIssue(secondsToLog, issueKeys.length);

  const commands = issueKeys.map((key, i) => {
    const seconds = issueTimes[i];
    return buildLogCommand(key, seconds)
  });

  return commands.filter(command => command.seconds !== 0);
}

function calculateSecondsToLog(issuesWithLoggedTime: WorklogIssue[]) {
  const totalSeconds = 8 * hour;
  const loggedSeconds = issuesWithLoggedTime
  .reduce((total, issue) => total + sumTime(issue.worklogs),0)
  
  return Math.max(totalSeconds - loggedSeconds, 0);
}

function sumTime(worklogs: Worklog[]) {
  return worklogs.reduce((total, worklog) => total + worklog.timeSpentSeconds, 0)
}

function calculateTimePerIssue(secondsToLog: number, numOfIssues: number) {
  let remainingSeconds = secondsToLog;
  const issueTimes = buildZerosArray(numOfIssues);
  let issueIndex = 0;

  while (canSubtractHour(remainingSeconds)) {
    issueTimes[issueIndex] += hour;
    remainingSeconds -= hour
    issueIndex = getNextIndex(issueIndex, numOfIssues)
  }
  
  issueTimes[issueIndex] += remainingSeconds;
  return issueTimes
}

function buildZerosArray(length: number) {
  const zeros: number[] = [];

  while(length > 0) {
    zeros.push(0);
    length--;
  }
  
  return zeros;
}

function canSubtractHour(seconds: number) {
  return (seconds - hour) >= 0
}

function getNextIndex(currentIndex: number, arrayLength: number) {
  const lastIndex = arrayLength - 1;
  return currentIndex === lastIndex ? 0 : currentIndex + 1;
}

function buildLogCommand(issueKey: string, seconds: number): LogCommand {
  return {issueKey, seconds}
}