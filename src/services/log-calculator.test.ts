import { LogCalculator } from "./log-calculator";
import { Commit } from "../jira-client/jira-client"
// import { formatDate } from "../utils"
import { CommitsForIssue } from '../models/timesheet-models';

describe('log calculator', () => {

 let logCalculator: LogCalculator;
 let commit1: Commit;
 let dateOfCommitText: string;

  beforeAll(() => {
    logCalculator = new LogCalculator();
    dateOfCommitText = '2020-10-21';
    commit1 = {
        id: '123',
        author: {
            name: 'fguerreiro'
        },
        timestamp: `${dateOfCommitText}T00:12:38Z`
    }

  })

  it('#calculateFromCommits should produce a logCommand', () => {
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

  it('#calculateFromCommits should have proper Issue key Id', () => {
    const expectedIssueKey = 'SFCT-4242';
    const commit1: Commit = {
        id: '123',
        author: {
            name: 'fguerreiro'
        },
        timestamp: `${dateOfCommitText}T00:12:38Z`
    }

    const commitsForIssue: CommitsForIssue = {
        commits: [commit1],
        issueKey: expectedIssueKey
    }
    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [commitsForIssue]);

    expect(result).toBeDefined();
    expect(result.logCommands[0].issueKey).toBe(expectedIssueKey);
  })
});