import { Worklog, WorklogIssue } from '../../jira-client/jira-client';


export enum Summary {
  NoIssues = 'Warning: no issues found.',
  Complete = 'Complete: 8h already logged.',
  AboveLimit = 'Warning: more than 8h are logged.',
  WillLog = 'Logging time'
}

export interface Plan {
  commands: LogCommand[],
  message: Summary;
}

export interface LogCommand {
  issueKey: string,
  seconds: number
}

const hour = 3600;

export function generatePlan(issueKeys: string[], issuesWithLoggedTime: WorklogIssue[]) {
  const numOfIssues = issueKeys.length;
  const secondsToLog = calculateSecondsToLog(issuesWithLoggedTime);
  const issueTimes = calculateTimePerIssue(secondsToLog, numOfIssues);

  const commands = issueKeys.map((key, i) => {
    const seconds = issueTimes[i];
    return buildLogCommand(key, seconds)
  })
  .filter(command => command.seconds !== 0);

  const message = determineMessage(secondsToLog, numOfIssues);

  return {commands, message}
}

function calculateSecondsToLog(issuesWithLoggedTime: WorklogIssue[]) {
  const totalSeconds = 8 * hour;
  const loggedSeconds = issuesWithLoggedTime
  .reduce((total, issue) => total + sumTime(issue.worklogs),0)
  
  return totalSeconds - loggedSeconds;
}

function sumTime(worklogs: Worklog[]) {
  return worklogs.reduce((total, worklog) => total + worklog.timeSpentSeconds, 0)
}

function calculateTimePerIssue(secondsToLog: number, numOfIssues: number) {
  let remainingSeconds = Math.max(secondsToLog, 0);
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

function determineMessage(secondsToLog: number, numOfIssues: number) {
  if (secondsToLog < 0) {
    return Summary.AboveLimit;
  }

  if (secondsToLog === 0) {
    return Summary.Complete;
  }

  if (numOfIssues === 0) {
    return Summary.NoIssues;
  }
  
  return Summary.WillLog;
}