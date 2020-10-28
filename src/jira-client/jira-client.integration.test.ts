import {JiraClient} from './jira-client';
import axios from 'axios';
import { JiraCredentialsResolver } from '../security/jira-credentials-resolver';

it('#getIssuesInProgress returns a valid response with issues', async () => {
  const client = new JiraClient(axios, new JiraCredentialsResolver());
  const result = await client.getIssuesInProgress();

  expect(result.data).toMatchObject({
    issues: []
  })
})

// it('#getUsers return users', async () => {
//   const client = new JiraClient(axios, new JiraCredentialsResolver());
//   const result = await client.getUsers()
//   expect(result).toEqual([]);
// })