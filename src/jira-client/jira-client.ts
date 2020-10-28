import { AxiosStatic } from 'axios';
import { ICredentialsResolver } from '../security/jira-credentials-resolver'

interface LogTimeProps {
  issueId: string;
  hours: number;
  utc: Date;
}

export interface User {
  self: string;
  accountId: string;
  accountType: string;
  emailAddress: string;
  avatarUrls: Record<string, string>;
  displayName: string;
  active: boolean;
  locale: string;
}

export class JiraClient {
  constructor(private http: AxiosStatic, private credentialsResolver: ICredentialsResolver) {}

  public async logTime(options: LogTimeProps) {
    const {issueId, hours, utc} = options;
    
    const url = `https://coveord.atlassian.net/rest/api/2/issue/${issueId}/worklog?adjustEstimate=auto`

    const data = {
      started: buildDateString(utc),
      timeSpent: `${hours}h`
    }

    await this.http.post(url, data);
  }

  public async getUsers() {
    let offset = 0;
    const maxResults = 100;

    let users: User[] = [];

    while(true) {
      const response = await this.getUsersPaginated(offset, maxResults);
      const data = response?.data;

      if (!data) {
        break;
      }

      users = users.concat(data);

      if (data.length !== maxResults) {
        break;
      }
      
      offset += maxResults;
    }

    return users.filter(u => u.active); // !TODO Note - opt in vs opt out? users afffected
  }
  
  public async getIssuesInProgress() {
    // /search?startAt=0&maxResults=100&fields=issuetype%2Cstatus%2Csummary&jql=assignee%20=%20currentUser()%20and%20status%20=%20%27in%20progress%27%20order%20by%20created%20DESC
  
    const startAt = 'startAt=0';
    const maxResults = 'maxResults=100';
    const fields = 'fields=issuetype,status,summary';
    const jql = "assignee = currentUser()  and development[commits].open > 0 and Updated  > 2020-10-26 order by created DESC";
    const url = `https://coveord.atlassian.net/rest/api/2/search?${startAt}&${maxResults}&${fields}&${jql}`;
  
    return await this.http.get(url);
  }

  private getHeaders() {
    const apiToken = this.credentialsResolver.getApiToken();
    const email = this.credentialsResolver.getEmail();
    const auth = Buffer.from(`${email}:${apiToken}`).toString('base64');
    return {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }
  }

  private async getUsersPaginated(offset: number, maxResults: number) {
    const headers = this.getHeaders();
    return await this.http.get<User[]>(`https://coveord.atlassian.net/rest/api/3/users?startAt=${offset}&maxResults=${maxResults}`, {headers})
  }
}

function buildDateString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();

  return `${year}-${month}-${day}T09:00:00.000+0000`
}


// Get all active users from paginated api

// Improve authentication flow (extract the api key better and inject in the constructor)
// Make getIssuesInProgress more flexible (receive user displayname as parameter)

// Improve proof-of-work determination (someone may not have issues in progress)