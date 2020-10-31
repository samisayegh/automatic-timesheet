import * as dayjs from 'dayjs';
import { getActiveIssueKeysForDate } from "./work-filter"
import { buildIssueInfo } from '../../mocks/mock-issue-info';
import { buildCommit } from '../../mocks/mock-commit';

describe('work filter', () => {
  it('when an issue has a commit on the target date, it returns the issue', () => {
    const date = '2020-10-30';
    const issueKey = 'A';

    const issueInfo = buildIssueInfo({
      issueKey,
      commits: [buildCommit({timestamp: date })]
    })

    const result = getActiveIssueKeysForDate(dayjs(date).toDate(), [issueInfo])
    expect(result).toEqual([issueKey])
  });

  it('when an issue does not have a commit on the target date, it does not return the issue', () => {
    const date = '2020-10-30';
    const issueKey = 'A';

    const issueInfo = buildIssueInfo({
      issueKey,
      commits: [buildCommit({timestamp: '2020-10-31' })]
    })

    const result = getActiveIssueKeysForDate(dayjs(date).toDate(), [issueInfo])
    expect(result).toEqual([])
  });
})