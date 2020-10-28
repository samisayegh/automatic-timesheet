import { LogCalculator } from "./log-calculator";
import { Commit } from "../jira-client/jira-client"
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
    expect(result.logCommands[0].issueKey).toBe(expectedIssueKey1);  
    expect(result.logCommands[1].issueKey).toBe(expectedIssueKey2);
  })

  it('#calculateFromCommits should log first two issues even if more than two are passed', () => {
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

    const commitsForIssue3: CommitsForIssue = {
        commits: [commit2],
        issueKey: 'SFCT-0001'
    }

    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [commitsForIssue1, commitsForIssue2, commitsForIssue3]);

    expect(result).toBeDefined();
    expect(result.logCommands).toHaveLength(2);
    expect(result.logCommands[0].issueKey).toBe(expectedIssueKey1);  
    expect(result.logCommands[1].issueKey).toBe(expectedIssueKey2);
  })

  it('#calculateFromCommits should not produce log commands if commits are outside date given', () => {
    const expectedIssueKey1 = 'SFCT-4242';
    const expectedIssueKey2 = 'SFCT-4343';
    const differentDate = '2020-01-01';

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

    const result = logCalculator.calculateFromCommits(new Date(differentDate), [commitsForIssue1, commitsForIssue2]);

    expect(result).toBeDefined();
    expect(result.logCommands).toHaveLength(0);
  })

  it('#calculateFromCommitsRetroactive should produce logcommands for two given dates when commits correspond the dates', () => {
    const expectedIssueKey1 = 'SFCT-4242';
    const expectedIssueKey2 = 'SFCT-4343';
    const date1 = '2020-01-01';
    const date2 = '2020-01-02';
    const dates = [new Date(date1), new Date(date2)];

    const commit1 = {
        id: '122',
        author: {
            name: 'fguerreiro'
        },
        timestamp: `${date1}T01:12:38Z`
    }

    const commit2 = {
        id: '1234',
        author: {
            name: 'fguerreiro'
        },
        timestamp: `${date2}T02:12:38Z`
    }

    const commitsForIssue1: CommitsForIssue = {
        commits: [commit1],
        issueKey: expectedIssueKey1
    }

    const commitsForIssue2: CommitsForIssue = {
        commits: [commit2],
        issueKey: expectedIssueKey2
    }

    const result = logCalculator.calculateFromCommitsRetroactive(dates, [commitsForIssue1, commitsForIssue2]);

    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result[0].logCommands).toHaveLength(1);
    expect(result[0].logCommands[0].issueKey).toBe(expectedIssueKey1);
    expect(result[1].logCommands).toHaveLength(1);
    expect(result[1].logCommands[0].issueKey).toBe(expectedIssueKey2);
  })
});