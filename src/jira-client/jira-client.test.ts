import axios from 'axios';
import {JiraClient} from './jira-client';


jest.mock('axios');

describe('Jira Client', () => {
  it('#logTime sends a request with the correct params', async () => {
    const client = new JiraClient(axios);

    await client.logTime({
      issueId: 'KIT-123',
      workLogId: 1,
      hours: 2
    })

    const url = 'https://coveord.atlassian.net/rest/api/2/issue/KIT-123/worklog?adjustEstimate=auto&_r=1'
    const data = {timeSpent: '2h'}

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenCalledWith(url, data);
  })

})