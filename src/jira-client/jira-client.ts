import { AxiosStatic } from 'axios';

interface LogTimeProps {
  issueId: string;
  hours: number;
  utc: Date;
}

export class JiraClient {
  constructor(private http: AxiosStatic) {}

  public async logTime(options: LogTimeProps) {
    const {issueId, hours, utc} = options;
    
    const url = `https://coveord.atlassian.net/rest/api/2/issue/${issueId}/worklog?adjustEstimate=auto`

    const data = {
      started: buildDateString(utc),
      timeSpent: `${hours}h`
    }

    await this.http.post(url, data);
  }
  
  public async getIssuesInProgress() {
    // /search?startAt=0&maxResults=100&fields=issuetype%2Cstatus%2Csummary&jql=assignee%20=%20currentUser()%20and%20status%20=%20%27in%20progress%27%20order%20by%20created%20DESC
  
    const startAt = 'startAt=0';
    const maxResults = 'maxResults=100';
    const fields = 'fields=issuetype,status,summary';
    const jql = "assignee = currentUser() and status = 'in progress' order by created DESC";
    const url = `https://coveord.atlassian.net/rest/api/2/search?${startAt}&${maxResults}&${fields}&${jql}`;
  
    const result = await this.http.get(url);
    console.log(JSON.stringify(result));
    return await this.http.get(url);
  }
}

function buildDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return `${year}-${month}-${day}T09:00:00.000+0000`
}