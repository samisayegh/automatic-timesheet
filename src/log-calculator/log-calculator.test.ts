import { LogCalculator } from "./log-calculator";
import { buildIssueInfo } from '../mocks/mock-issue-info';
import { buildCommit } from '../mocks/mock-commit';
import { buildLogPlan } from '../mocks/mock-log-plan';
import { buildLogCommand } from '../mocks/mock-log-command';
import { Summary } from './planner/planner';

describe('log calculator', () => {

  let logCalculator: LogCalculator;
  
  beforeAll(() => {
    logCalculator = new LogCalculator();
  })

  it('#calculateLogPlan should produce the correct plan for an issue having a commit on the log date', () => {
    const issueKey = 'SFCT-4242';
    const dateString = '2020-01-01';
    const logDate = new Date(dateString);
    const commit = buildCommit({timestamp: `${dateString}T01:12:38Z`});
    const commitsForIssue = buildIssueInfo({commits: [commit], issueKey})
    
    const result = logCalculator.calculateLogPlan(logDate, [commitsForIssue], []);

    const commands =  [buildLogCommand({issueKey, seconds: 8 * 3600})];
    
    expect(result).toEqual(buildLogPlan({logDate, commands, message: Summary.WillLog}))
  });

  it('#calculateLogPlan should not produce the correct plan for an issue not having a commit on the log date', () => {
    const issueKey = 'SFCT-4242';
    const commit = buildCommit({timestamp: `2020-01-01T01:12:38Z`});
    const commitsForIssue = buildIssueInfo({commits: [commit], issueKey})
    
    const logDate = new Date('2020-01-02');
    const result = logCalculator.calculateLogPlan(logDate, [commitsForIssue], []);

    expect(result).toEqual(buildLogPlan({logDate, commands: [], message: Summary.NoIssues}))
  });
});