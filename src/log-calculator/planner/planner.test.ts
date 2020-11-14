import { buildLogCommand } from '../../mocks/mock-log-command';
import { buildWorklog } from '../../mocks/mock-worklog';
import { buildWorklogIssue } from '../../mocks/mock-worklog-issue';
import { generatePlan } from "./planner";

describe('#generatePlan', () => {
  it(`when there are no issues, it returns an empty array`, () => {
    const result = generatePlan([], []);
    expect(result).toEqual([])
  })
  
  it(`when there is one issue, when the issues with logged time sum to 8 hours,
  it returns an empty array`, () => {
    const worklogs = [buildWorklog({timeSpentSeconds: 8 * 3600})]
    const issuesWithLoggedTime = [buildWorklogIssue({worklogs})];

    const result = generatePlan(['A'], issuesWithLoggedTime);
    expect(result).toEqual([])
  })

  it(`when there is one issue, when the issues with logged time sum to 7.5 hours,
  it allocates 30 minutes to the issue`, () => {
    const worklogs = [buildWorklog({timeSpentSeconds: 7.5 * 3600})]
    const issuesWithLoggedTime = [buildWorklogIssue({worklogs})];

    const result = generatePlan(['A'], issuesWithLoggedTime);
    const command = buildLogCommand({issueKey: 'A', seconds: 30 * 60})
    expect(result).toEqual([command])
  })

  it(`when there is one issue, when the issues with logged time sum to more than 8 hours,
  it returns an empty array`, () => {
    const worklogs = [buildWorklog({timeSpentSeconds: 9 * 3600})]
    const issuesWithLoggedTime = [buildWorklogIssue({worklogs})];

    const result = generatePlan(['A'], issuesWithLoggedTime);
    expect(result).toEqual([])
  })

  it(`when there is one issue, and no issues with logged time,
  it allocates 8 hours to the issue`, () => {
    const result = generatePlan(['A'], []);

    const command = buildLogCommand({issueKey: 'A', seconds: 8 * 3600})
    expect(result).toEqual([command])
  });

  it(`when there are two issues, and no issues with logged time,
  it allocates 4 hours to each issue`, () => {
    const result = generatePlan(['A', 'B'], []);

    const command1 = buildLogCommand({issueKey: 'A', seconds: 4 * 3600});
    const command2 = buildLogCommand({issueKey: 'B', seconds: 4 * 3600});
    
    expect(result).toEqual([command1, command2])
  });

  it(`when there are three issues, and no issues with logged time,
  it allocates 3, 3, 2 hours to each issue`, () => {
    const result = generatePlan(['A', 'B', 'C'], []);

    const command1 = buildLogCommand({issueKey: 'A', seconds: 3 * 3600});
    const command2 = buildLogCommand({issueKey: 'B', seconds: 3 * 3600});
    const command3 = buildLogCommand({issueKey: 'C', seconds: 2 * 3600});

    expect(result).toEqual([command1, command2, command3])
  });

  it(`when there are five issues, and no issues with logged time,
  it allocates 2,2,2,1,1 hours to each issue`, () => {
    const result = generatePlan(['A', 'B', 'C', 'D', 'E'], []);

    const command1 = buildLogCommand({issueKey: 'A', seconds: 2 * 3600});
    const command2 = buildLogCommand({issueKey: 'B', seconds: 2 * 3600});
    const command3 = buildLogCommand({issueKey: 'C', seconds: 2 * 3600});
    const command4 = buildLogCommand({issueKey: 'D', seconds: 1 * 3600});
    const command5 = buildLogCommand({issueKey: 'E', seconds: 1 * 3600});

    expect(result).toEqual([command1, command2, command3, command4, command5])
  });

  it(`when there are six issues, and no issues with logged time,
  it allocates 2,2,1,1,1,1 hours to each issue`, () => {
    const result = generatePlan(['A', 'B', 'C', 'D', 'E', 'F'], []);

    const command1 = buildLogCommand({issueKey: 'A', seconds: 2 * 3600});
    const command2 = buildLogCommand({issueKey: 'B', seconds: 2 * 3600});
    const command3 = buildLogCommand({issueKey: 'C', seconds: 1 * 3600});
    const command4 = buildLogCommand({issueKey: 'D', seconds: 1 * 3600});
    const command5 = buildLogCommand({issueKey: 'E', seconds: 1 * 3600});
    const command6 = buildLogCommand({issueKey: 'F', seconds: 1 * 3600});

    expect(result).toEqual([
      command1,
      command2,
      command3,
      command4,
      command5,
      command6,
    ])
  });

  it(`when there are four issues, and an issue with two hours logged,
  it allocates 2,2,1,1 hours to the four issues`, () => {
    const worklogs = [buildWorklog({timeSpentSeconds: 2 * 3600})]
    const issuesWithLoggedTime = [buildWorklogIssue({worklogs})];

    const result = generatePlan(['A', 'B', 'C', 'D'], issuesWithLoggedTime);

    const command1 = buildLogCommand({issueKey: 'A', seconds: 2 * 3600});
    const command2 = buildLogCommand({issueKey: 'B', seconds: 2 * 3600});
    const command3 = buildLogCommand({issueKey: 'C', seconds: 1 * 3600});
    const command4 = buildLogCommand({issueKey: 'D', seconds: 1 * 3600});

    expect(result).toEqual([command1, command2, command3, command4])
  });
})