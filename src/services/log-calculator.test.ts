import { LogCalculator } from "./log-calculator";
import { Commit } from "../jira-client/jira-client"
import { IssueInfo } from '../models/timesheet-models';

describe('log calculator', () => {

  let logCalculator: LogCalculator;
  let commit1: Commit;
  let dateOfCommitText: string;

  function buildCommit(config: Partial<Commit> = {}): Commit {
    return {
      author: {
        name: ''
      },
      id: '',
      timestamp: '',
      ...config
    }
  }

  function buildIssueInfo(config: Partial<IssueInfo> = {}): IssueInfo {
    return {
      issueKey: '',
      commits: [],
      ...config
    }
  }

  beforeAll(() => {
    logCalculator = new LogCalculator();
    dateOfCommitText = '2020-10-21';

    commit1 = buildCommit({timestamp: `${dateOfCommitText}T00:12:38Z`})
  })
  
  it('#calculateFromCommits should have proper Issue key Id', () => {
    const expectedIssueKey = 'SFCT-4242';
    const issueInfo = buildIssueInfo({ issueKey: expectedIssueKey, commits: [commit1]})
    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [issueInfo]);

    expect(result.logCommands).toHaveLength(1);
    expect(result.logCommands[0].issueKey).toBe(expectedIssueKey);
  })

  it('#calculateFromCommits should produce two log commands', () => {
    const expectedIssueKey1 = 'SFCT-4242';
    const expectedIssueKey2 = 'SFCT-4343';

    const commit2 = buildCommit({timestamp: `${dateOfCommitText}T02:12:38Z`});
    const issueInfo1 = buildIssueInfo({commits: [commit1], issueKey: expectedIssueKey1});
    const issueInfo2 = buildIssueInfo({commits: [commit2], issueKey: expectedIssueKey2});
    
    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [issueInfo1, issueInfo2]);

    expect(result.logCommands).toHaveLength(2);
    expect(result.logCommands[0].issueKey).toBe(expectedIssueKey1);
    expect(result.logCommands[1].issueKey).toBe(expectedIssueKey2);
  })

  it('#calculateFromCommits should log first two issues even if more than two are passed', () => {
    const expectedIssueKey1 = 'SFCT-4242';
    const expectedIssueKey2 = 'SFCT-4343';

    const commit2 = buildCommit({ timestamp: `${dateOfCommitText}T02:12:38Z`});

    const commitsForIssue1 = buildIssueInfo({ commits: [commit1], issueKey: expectedIssueKey1});
    const commitsForIssue2 = buildIssueInfo({ commits: [commit2], issueKey: expectedIssueKey2 });
    const commitsForIssue3 = buildIssueInfo({ commits: [commit2], issueKey: 'SFCT-0001'});

    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [commitsForIssue1, commitsForIssue2, commitsForIssue3]);

    expect(result.logCommands).toHaveLength(2);
    expect(result.logCommands[0].issueKey).toBe(expectedIssueKey1);
    expect(result.logCommands[1].issueKey).toBe(expectedIssueKey2);
  })

  it('#calculateFromCommits should not produce log commands if commits are outside date given', () => {
    const expectedIssueKey1 = 'SFCT-4242';
    const expectedIssueKey2 = 'SFCT-4343';
    const differentDate = '2020-01-01';

    const commit2 = buildCommit({ timestamp: `${dateOfCommitText}T02:12:38Z`});
    const commitsForIssue1 = buildIssueInfo({commits: [commit1], issueKey: expectedIssueKey1})
    const commitsForIssue2 = buildIssueInfo({commits: [commit2], issueKey: expectedIssueKey2})
    
    const result = logCalculator.calculateFromCommits(new Date(differentDate), [commitsForIssue1, commitsForIssue2]);

    expect(result.logCommands).toHaveLength(0);
  })

  it('#calculateFromCommitsRetroactive should produce logcommands for two given dates when commits correspond the dates', () => {
    const expectedIssueKey1 = 'SFCT-4242';
    const expectedIssueKey2 = 'SFCT-4343';
    const date1 = '2020-01-01';
    const date2 = '2020-01-02';
    const dates = [new Date(date1), new Date(date2)];

    const commit1 = buildCommit({timestamp: `${date1}T01:12:38Z`});
    const commit2 = buildCommit({timestamp: `${date2}T02:12:38Z`});

    const commitsForIssue1 = buildIssueInfo({commits: [commit1], issueKey: expectedIssueKey1})
    const commitsForIssue2 = buildIssueInfo({commits: [commit2], issueKey: expectedIssueKey2})
    
    const result = logCalculator.calculateFromCommitsRetroactive(dates, [commitsForIssue1, commitsForIssue2]);

    expect(result).toBeDefined();
    expect(result).toHaveLength(2);
    expect(result[0].logCommands).toHaveLength(1);
    expect(result[0].logCommands[0].issueKey).toBe(expectedIssueKey1);
    expect(result[1].logCommands).toHaveLength(1);
    expect(result[1].logCommands[0].issueKey).toBe(expectedIssueKey2);
  })
});