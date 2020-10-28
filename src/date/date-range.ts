import * as dayjs from 'dayjs';

export function getDateRange(from: string, to: string) {
  const start = dayjs(from);
  const end = dayjs(to);
  
  const range: dayjs.Dayjs[] = [];
  let current = start;

  while(current.isBefore(end) || current.isSame(end)) {
    isWeekday(current) && range.push(current);
    current = current.add(1, 'day');
  }

  return range.map(date => format(date));
}

function format(date: dayjs.Dayjs) {
  return date.format('YYYY-MM-DD')
}

function isWeekday(date: dayjs.Dayjs) {
  const isSaturday = date.day() === 6;
  const isSunday = date.day() === 0;
  return !isSaturday && !isSunday;
}