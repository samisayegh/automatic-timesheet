import axios from 'axios';
import {JiraClient} from './jira-client';


jest.mock('axios');

describe('Jira Client', () => {
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

  // it('#getIssuesInProgress sends a request', async () => {
  //   const client = new JiraClient(axios);

  //   const result = await client.getIssuesInProgress();

  //   console.log(JSON.stringify(result));
  //   expect(axios.get).toHaveBeenCalledTimes(1);
  // })
})