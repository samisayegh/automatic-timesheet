import { AxiosStatic } from 'axios';
import { ICredentialsResolver } from '../security/jira-credentials-resolver'

interface LogTimeProps {
  issueId: string; // this might be issueKey
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

interface DevDetails {
  developmentInformation: {
    details: {
      instanceTypes: InstanceType[]
    }
  }
}

interface InstanceType {
  respository: Repository[];
}

interface Repository {
  commits: Commit[]
}

export interface Commit {
  id: string;
  timestamp: string;
  author: {
    name: string;
  }
}

interface IssuesWithWorklogsResponse {
  total: number;
  issues: Issue[];
}

interface Issue {
  id: string;
  key: string;
  fields: {
    worklog: {
      worklogs: Worklog[];
    }
  }
}

interface Worklog {
  started: string;
  timeSpentSeconds: number;
  id: string;
  issueId: string;
}

export interface UserIssueResponse {
  issueId: string;
  issueKey: string; // todo: Verify if JSON really returns the issues key
}

export class JiraClient {
  constructor(private http: AxiosStatic, private credentialsResolver: ICredentialsResolver) {}
  
  public async getIssuesWithWorkLogs(displayName: string, from: Date, to: Date) {
    const startAt = '0';
    const maxResults = '1000';
    const fields = 'worklog';

    const start = buildYearMonthDayString(from);
    const end = buildYearMonthDayString(to);
    const jql = `worklogDate >= "${start}" and worklogDate < "${end}" and worklogAuthor in ("${displayName}")`;
    
    const url = `https://coveord.atlassian.net/rest/api/2/search?fields=${fields}&maxResults=${maxResults}&jql=${jql}&startAt=${startAt}`;
    const headers = this.getHeaders();
    const res = await this.http.get<IssuesWithWorklogsResponse>(url, {headers});

    return res?.data;
  }

  public async logTime(options: LogTimeProps) {
    const {issueId, hours, utc} = options;
    
    const url = `https://coveord.atlassian.net/rest/api/2/issue/${issueId}/worklog?adjustEstimate=auto`

    const data = {
      started: buildDateTimeString(utc),
      timeSpent: `${hours}h`
    }

    await this.http.post(url, data);
  }

  public async getDevDetailsForIssue(issueId: string) {
    const url = 'https://coveord.atlassian.net/jsw/graphql?operation=DevDetailsDialog';
    const query = `
    query DevDetailsDialog($issueId: ID!) {
      developmentInformation(issueId: $issueId) {
        details {
          instanceTypes {
            repository {
              commits {
                id
                timestamp
                author {
                  name
                }
              }
            }
          }
        }
      }
    }
    `;
    
    const variables = {issueId}
    const headers = this.getHeaders()

    const response = await this.http.post<DevDetails>(url, {query, variables}, {headers})
    return response?.data
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
  
  // move this to the service
  // public async 

  // accepts a start date and end date
  // returns the issue Ids
  public async getIssuesInProgress(dateStart: Date, dateEnd: Date) {
    // First, we try to get all issues which have been updated in the time window AND contains commits related
    const startAt = 'startAt=0';
    const maxResults = 'maxResults=100';
    const fields = 'fields=issuetype,status,summary';
    const jql = `assignee = currentUser() and development[commits].all > 0 and Updated >= "${dateStart} 00:00" and Updated <= "${dateEnd} 23:59"`;
    const url = `https://coveord.atlassian.net/rest/api/2/search?${startAt}&${maxResults}&${fields}&${jql}`;
  
    // output: issue key, issue id
    return await this.http.get<UserIssueResponse>(url);
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

function buildDateTimeString(date: Date) {
  const ymd = buildYearMonthDayString(date);
  return `${ymd}T09:00:00.000+0000`;
}

function buildYearMonthDayString(date: Date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate() + 1;

  return `${year}-${month}-${day}`;
}


// Get all active users from paginated api

// Improve authentication flow (extract the api key better and inject in the constructor)
// Make getIssuesInProgress more flexible (receive user displayname as parameter)

// Improve proof-of-work determination (someone may not have issues in progress)