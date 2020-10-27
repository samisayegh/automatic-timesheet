import { AxiosStatic } from 'axios';

interface LogTimeProps {
  issueId: string;
  workLogId: number;
  hours: number;
}

export class JiraClient {
  constructor(private http: AxiosStatic) {}

  public async logTime(options: LogTimeProps) {
    const {issueId, workLogId, hours} = options;
    
    const url = `https://coveord.atlassian.net/rest/api/2/issue/${issueId}/worklog?adjustEstimate=auto&_r=${workLogId}`
    const data = {
      timeSpent: `${hours}h`
    }

    await this.http.post(url, data);
  }
}