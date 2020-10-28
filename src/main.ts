import {jiraClient} from './composition-root'
import { JiraClient, UserIssueResponse } from './jira-client/jira-client';
import { LogCalculator } from './services/log-calculator';

/**
 * Some predefined delays (in milliseconds).
 */
export enum Delays {
  Short = 500,
  Medium = 2000,
  Long = 5000,
}

async function main() {
  
  // those are inputs from the CLI
  const dateStart = new Date('2020-10-28');

  // this will be incremented by 7 days, we could remove from the API parameters
  const dateEnd = new Date('2020-10-28');

  // to do -> from the dateStart and dateEnd produce the list of dates to log
  const allDates = [dateStart]; // Sami will build the func

  // Fetch the Issues

  // to be fixed to have many issues
  const issues = await jiraClient.getIssuesInProgress(dateStart, dateEnd);
  
  // Fetch Commits
  
  // transform the devtails to commit infos
  // const commits = (await devDetails).developmentInformation.details.instanceTypes[0].respository[0].commits;

  // log calculator
  const calculator = new LogCalculator();
  const logTimes = calculator.calculateFromCommitsRetroactive(allDates, commits);

  // log time
}

async function getCommitsAndIssueKeys(issue: UserIssueResponse, client: JiraClient) {
  // for each issues get the commits for it
  const devDetails = await client.getDevDetailsForIssue(issue.issueId);

  return {
    issue,
    commits: devDetails.developmentInformation.details.instanceTypes[0].respository[0].commits
  }
}

/**
 * Returns a Promise<string> that resolves after given time.
 *
 * @param {string} name - A name.
 * @param {number=} [delay=Delays.Medium] - Number of milliseconds to delay resolution of the Promise.
 * @returns {Promise<string>}
 */
function delayedHello(
  name: string,
  delay: number = Delays.Medium,
): Promise<string> {
  return new Promise((resolve: (value?: string) => void) =>
    setTimeout(() => resolve(`Hello, ${name}`), delay),
  );
}

// Below are examples of using ESLint errors suppression
// Here it is suppressing missing return type definitions for greeter function

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export async function greeter(name: string) {
  return await delayedHello(name, Delays.Long);
}
