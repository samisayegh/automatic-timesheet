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
  })

  it('#calculateFromCommits should have proper Issue key Id', () => {
    const expectedIssueKey = 'SFCT-4242';
    const commitsForIssue: CommitsForIssue = {
        commits: [commit1],
        issueKey: expectedIssueKey
    }
    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [commitsForIssue]);

    expect(result).toBeDefined();
    expect(result.logCommands[0].issueKey).toBe(expectedIssueKey);
  })

  it('#calculateFromCommits should produce two log commands', () => {
    const expectedIssueKey1 = 'SFCT-4242';
    const expectedIssueKey2 = 'SFCT-4343';

    const commit2 = {
        id: '1234',
        author: {
            name: 'fguerreiro'
        },
        timestamp: `${dateOfCommitText}T02:12:38Z`
    }

    const commitsForIssue1: CommitsForIssue = {
        commits: [commit1],
        issueKey: expectedIssueKey1
    }

    const commitsForIssue2: CommitsForIssue = {
        commits: [commit2],
        issueKey: expectedIssueKey2
    }

    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [commitsForIssue1, commitsForIssue2]);

    expect(result).toBeDefined();
    expect(result.logCommands).toHaveLength(2);
    // expect(result.logCommands[0].issueKey).toBe(expectedIssueKey1);  
    // expect(result.logCommands[1].issueKey).toBe(expectedIssueKey2);
  })

  // todo: should produce two log commands with separate issues
  // should produce 2 log commands for the same day
  // should not produce log commands outside the date range
});