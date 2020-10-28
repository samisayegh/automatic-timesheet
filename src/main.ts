import {jiraClient} from './composition-root'
import { JiraClient, UserIssueResponse } from './jira-client/jira-client';
import { LogCalculator } from './services/log-calculator';

// @ts-ignore
async function main() {
  
  // those are inputs from the CLI
  const dateStart = new Date('2020-10-28');

  // this will be incremented by 7 days, we could remove from the API parameters
  const dateEnd = new Date('2020-10-28');

  // to do -> from the dateStart and dateEnd produce the list of dates to log
  const allDates = [dateStart]; // Sami will build the func

  // Fetch the Issues

  // to be fixed to have many issues
  // @ts-ignore
  const issues = await jiraClient.getIssuesInProgress(dateStart, dateEnd);
  
  // Fetch Commits
  
  // transform the devtails to commit infos
  // const commits = (await devDetails).developmentInformation.details.instanceTypes[0].respository[0].commits;

  // log calculator
  const calculator = new LogCalculator();
  // @ts-ignore
  const logTimes = calculator.calculateFromCommitsRetroactive(allDates, commits);

  // log time
}

// @ts-ignore
async function getCommitsAndIssueKeys(issue: UserIssueResponse, client: JiraClient) {
  // for each issues get the commits for it
  const devDetails = await client.getDevDetailsForIssue(issue.issueId);

  return {
    issue,
    commits: devDetails.developmentInformation.details.instanceTypes[0].respository[0].commits
  }
}
