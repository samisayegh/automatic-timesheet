import { getDateRange } from "./date"

describe('getDateRange', () => {
  it('when a the start and end dates match, it returns an array with one entry', () => {
    const range = getDateRange('2020-10-26', '2020-10-26');
    expect(range).toEqual(['2020-10-26'])
  });

  it('when the start date is unparsable, it returns an empty array', () => {
    const range = getDateRange('@', 'null');
    expect(range).toEqual([])
  });

  it('when the start is after the end, it returns an empty array', () => {
    const range = getDateRange('2020-10-26', '2020-10-25');
    expect(range).toEqual([])
  });

  it('when the end is the day after the start date, it returns both dates', () => {
    const range = getDateRange('2020-10-26', '2020-10-27');
    expect(range).toEqual(['2020-10-26', '2020-10-27'])
  })

  it('when the end is a working day after the start date separated by a weekend, it returns both days', () => {
    const range = getDateRange('2020-10-23', '2020-10-26');
    expect(range).toEqual(['2020-10-23', '2020-10-26'])
  })
})