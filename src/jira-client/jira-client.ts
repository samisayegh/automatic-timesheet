import { AxiosStatic } from 'axios';

interface LogTimeProps {
  issueId: string;
  workLogId: number;
  hours: number;
  utc: Date;
}

export class JiraClient {
  constructor(private http: AxiosStatic) {}

  public async logTime(options: LogTimeProps) {
    const {issueId, workLogId, hours, utc} = options;
    
    const url = `https://coveord.atlassian.net/rest/api/2/issue/${issueId}/worklog?adjustEstimate=auto&_r=${workLogId}`

    const data = {
      started: buildDateString(utc),
      timeSpent: `${hours}h`
    }

    await this.http.post(url, data);
  }
}

function buildDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return `${year}-${month}-${day}T09:00:00.000+0000`
}