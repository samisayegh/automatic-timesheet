import { LogCalculator } from "./log-calculator";
import { Commit } from "../jira-client/jira-client"

describe('log calculator', () => {
  it('asserts correctly', () => {
    expect(true).toBe(true);
  });

  it('calculates correctly happy path', () => {
    const logCalculator = new LogCalculator();
    const commit1: Commit = {
        id: '123',
        author: {
            name: 'fguerreiro'
        },
        timestamp: '2020-10-21T19:12:38Z'
    }

    const result = logCalculator.calculateFromCommits(new Date(), [commit1]);
    expect(result).toBeDefined();
    // expect(result.dateToLog.getDay).toBe(new Date('2020-10-21').getDay());
  })
});