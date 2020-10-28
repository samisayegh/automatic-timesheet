import axios from 'axios';
import { buildMockUser } from '../mocks/mock-user';
import { JiraCredentialsResolver } from '../security/jira-credentials-resolver';
import { JiraClient, User } from './jira-client';

jest.mock('axios');

describe('Jira Client', () => {
  function buildClient() {
    return new JiraClient(axios, new JiraCredentialsResolver());
  }
  
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset();
    (axios.post as jest.Mock).mockReset();
  })

  it('#getIssuesWithWorkLogs sends a request with the correct params', async () => {
    const client = buildClient();

    const user = 'User A';
    const from = '2020-10-25';
    const to = '2020-10-26';
    const start = new Date(from);
    const end = new Date(to);

    await client.getIssuesWithWorkLogs(user, start, end);
    const any = expect.anything();

    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('https://coveord.atlassian.net/rest/api/2/search'), any);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('fields=worklog'), any);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('maxResults=1000'), any);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`worklogDate >= "${from}" and worklogDate < "${to}"`), any);
    expect(axios.get).toHaveBeenCalledWith(expect.stringContaining(`worklogAuthor in ("${user}")`), any)
  })

  it('#logTime sends a request with the correct params', async () => {
    const client = buildClient();
    
    const october27th = new Date('2020-10-27')
    
    await client.logTime({
      issueId: 'KIT-123',
      hours: 2,
      utc: october27th
    })

    const url = 'https://coveord.atlassian.net/rest/api/2/issue/KIT-123/worklog?adjustEstimate=auto'
    const data = {
      timeSpent: '2h',
      started: '2020-10-27T09:00:00.000+0000'
    }

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(url, data);
  })

  it('getDevDetailsForIssue sends a request with the correct params', async () => {
    const client = buildClient();
    await client.getDevDetailsForIssue('1');

    const data = {
      query: expect.stringContaining('commits'),
      variables: expect.objectContaining({issueId: '1'})
    }

    expect(axios.post).toHaveBeenCalledWith(
      'https://coveord.atlassian.net/jsw/graphql?operation=DevDetailsDialog',
      expect.objectContaining(data),
      expect.anything())
  }) 

  describe('#getUsers', () => {
    function buildActiveUsers(num: number) {
      const users: User[] = [];
      
      for (let i= 0; i < num; i++) {
        users.push(buildMockUser({ active: true }))
      }

      return users;
    }

    it('sends a get request with the correct params', async () => {
      const client = buildClient();
      await client.getUsers()

      const url = 'https://coveord.atlassian.net/rest/api/3/users?startAt=0&maxResults=100';
      
      expect(axios.get).toHaveBeenCalledWith(url, expect.anything())
    });

    it('when there are fewer users than maxResults, it does not try to get more users', async () => {
      const users = buildActiveUsers(1);
      (axios.get as jest.Mock).mockReturnValue({data: users});


      const client = buildClient();
      const result = await client.getUsers()

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(users);
    });

    it('when there are more users than maxResults, it tries to get more users', async () => {
      const hundredUsers = buildActiveUsers(100);
      (axios.get as jest.Mock).mockReturnValueOnce({data: hundredUsers});

      const client = buildClient();
      await client.getUsers()

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('startAt=0&maxResults=100'), expect.anything())
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('startAt=100&maxResults=100'), expect.anything())
    });

    it('when the first call yields 100 users, and the second yields 10, it returns 110 users', async () => {
      const hundredUsers = buildActiveUsers(100);
      const tenUsers = buildActiveUsers(10);

      (axios.get as jest.Mock).mockReturnValueOnce({data: hundredUsers});
      (axios.get as jest.Mock).mockReturnValueOnce({data: tenUsers});

      const client = buildClient();
      const result = await client.getUsers()

      expect(result.length).toBe(110);
    });

    it('when there is an active an inactive user, it returns just the active user', async() => {
      const active = buildMockUser({ displayName: 'A', active: true});
      const inactive = buildMockUser({ displayName: 'B', active: false});

      (axios.get as jest.Mock).mockReturnValueOnce({data: [active, inactive]});

      const client = buildClient();
      const result = await client.getUsers()

      expect(result).toEqual([active]);
    })
  })
})