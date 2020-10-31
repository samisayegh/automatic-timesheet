import * as dayjs from 'dayjs';
import { buildWorklogIssue } from '../../mocks/mock-worklog-issue';
import { buildWorklog } from '../../mocks/mock-worklog';
import { getWorklogIssuesForDate } from "./work-log-filter"

describe('work log filter', () => {
  it('when an issue has a work log on the date, it returns the issue', () => {
    const date = dayjs('2020-10-30').toDate();
    const worklog = buildWorklog({started: '2020-10-30T10:01:00.000-0400'})
    const worklogIssue = buildWorklogIssue({ worklogs: [worklog]})
    
    const result = getWorklogIssuesForDate(date, [worklogIssue]);
    expect(result).toEqual([worklogIssue]);
  });

  it('when an issue does not have a work log on the date, it does not return the issue', () => {
    const date = dayjs('2020-10-30').toDate();
    const worklog = buildWorklog({started: '2020-10-31T10:01:00.000-0400'})
    const worklogIssue = buildWorklogIssue({ worklogs: [worklog]})
    
    const result = getWorklogIssuesForDate(date, [worklogIssue]);
    expect(result).toEqual([]);
  });

  it(`when an issue has a work log on the date and a worklog not on the date,
  it returns the issue with just the work logs on the date`, () => {
    const date = dayjs('2020-10-30').toDate();
    const worklog1 = buildWorklog({started: '2020-10-30T10:01:00.000-0400'})
    const worklog2 = buildWorklog({started: '2020-10-31T10:01:00.000-0400'})

    const worklogIssue = buildWorklogIssue({ worklogs: [worklog1, worklog2]})
    const result = getWorklogIssuesForDate(date, [worklogIssue]);
    
    expect(result).toEqual([buildWorklogIssue({ worklogs: [worklog1]})]);
  })
})