import {JiraClient} from './jira-client';
import axios from 'axios';
import { JiraCredentialsResolver } from '../security/jira-credentials-resolver';
import { config } from 'dotenv';

config();

it('asserts correctly', () => {
  expect(true).toBe(true);
})

it('#getWorkLogs returns a valid response with issues', async () => {
  const client = new JiraClient(axios, new JiraCredentialsResolver());
  const result = await client.getWorkLogs(new Date('2020-10-20'), new Date('2020-10-20'));

  expect(result.issues.length).not.toBe(0);
})

it('#getIssuesInProgress returns a valid response with issues', async () => {
  const client = new JiraClient(axios, new JiraCredentialsResolver());
  const result = await client.getIssuesInProgress(new Date('2020-10-20'), new Date('2020-10-20'));

  expect(result.data.issues.length).not.toBe(0);
})

// it('#logTime returns undefined', async () => {
//   const client = new JiraClient(axios, new JiraCredentialsResolver());
//   const result = await client.logTime({
//     hours: 3,
//     issueKey: 'KIT-215',
//     utc: new Date('2020-10-28')
//   });

//   expect(result).toBe(undefined);
// })