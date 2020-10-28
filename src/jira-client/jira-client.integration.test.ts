import {JiraClient} from './jira-client';
import axios from 'axios';
import { JiraCredentialsResolver } from '../security/jira-credentials-resolver';

it('#getIssuesInProgress returns a valid response with issues', async () => {
  const client = new JiraClient(axios, new JiraCredentialsResolver());
  const result = await client.getIssuesInProgress('2020-10-27', '2020-10-27');

  expect(result.data).toMatchObject({
    issues: []
  })
})

// it('gets graphql results', async () => {
//   await client.getDevDetailsForIssue();
// })  

// it('#getUsers return users', async () => {
//   const client = new JiraClient(axios, new JiraCredentialsResolver());
//   const result = await client.getUsers()
//   expect(result).toEqual([]);
// })