import { LogCalculator } from "./log-calculator";
import { Commit } from "../jira-client/jira-client"
// import { formatDate } from "../utils"
import { CommitsForIssue } from '../models/timesheet-models';

describe('log calculator', () => {
  it('asserts correctly', () => {
    expect(true).toBe(true);
  });

  it('calculates correctly happy path', () => {
    const logCalculator = new LogCalculator();
    const dateOfCommitText = '2020-10-21';
    const commit1: Commit = {
        id: '123',
        author: {
            name: 'fguerreiro'
        },
        timestamp: `${dateOfCommitText}T00:12:38Z`
    }

    const commitsForIssue: CommitsForIssue = {
        commits: [commit1],
        issueKey: 'SFCT-4242'
    }
    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [commitsForIssue]);

    expect(result).toBeDefined();
    expect(result.logCommands).toHaveLength(1);
    // expect(formatDate(result.dateToLog)).toBe(dateOfCommitText);
    
    // expect(result.dateToLog.getMonth()).toBe(monthExpected);
  })
});