import axios from 'axios';
import { buildMockUser } from '../mocks/mock-user';
import {JiraClient, User} from './jira-client';

jest.mock('axios');

describe('Jira Client', () => {
  beforeEach(() => {
    (axios.get as jest.Mock).mockReset();
    (axios.post as jest.Mock).mockReset();
  })

  it('#logTime sends a request with the correct params', async () => {
    const client = new JiraClient(axios);
    
    const october27th = new Date()
    october27th.setUTCFullYear(2020, 10, 27);
    
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

  describe('#getUsers', () => {
    it('sends a get request with the correct params', async () => {
      const client = new JiraClient(axios);
      await client.getUsers()

      const url = 'https://coveord.atlassian.net/rest/api/3/users?startAt=0&maxResults=100';
      
      expect(axios.get).toHaveBeenCalledWith(url, expect.anything())
    });

    it('when there are fewer users than maxResults, it does not try to get more users', async () => {
      const users = [buildMockUser()];
      (axios.get as jest.Mock).mockReturnValue({data: users});


      const client = new JiraClient(axios);
      const result = await client.getUsers()

      expect(axios.get).toHaveBeenCalledTimes(1);
      expect(result).toEqual(users);
    });

    it('when there are more users than maxResults, it tries to get more users', async () => {
      const hundredUsers: User[] = [];
      
      for (let i= 0; i < 100; i++) {
        hundredUsers.push(buildMockUser())
      }

      (axios.get as jest.Mock).mockReturnValueOnce({data: hundredUsers});

      const client = new JiraClient(axios);
      await client.getUsers()

      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('startAt=0&maxResults=100'), expect.anything())
      expect(axios.get).toHaveBeenCalledWith(expect.stringContaining('startAt=100&maxResults=100'), expect.anything())
    })
  })
})