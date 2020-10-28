import { LogCalculator } from "./log-calculator";
import { Commit } from "../jira-client/jira-client"
import { formatDate } from "../utils"

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
        timestamp: `${dateOfCommitText}T19:12:38Z`
    }

    const result = logCalculator.calculateFromCommits(new Date(dateOfCommitText), [commit1]);

    console.log('result datelog: ' + formatDate(result.dateToLog));

    expect(result).toBeDefined();
    expect(formatDate(result.dateToLog)).toBe(dateOfCommitText);
    // expect(result.dateToLog.getMonth()).toBe(monthExpected);
  })
});