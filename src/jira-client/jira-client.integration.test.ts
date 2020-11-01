import {JiraClient} from './jira-client';
import axios from 'axios';
import { JiraCredentialsResolver } from '../security/jira-credentials-resolver';
import { config } from 'dotenv';
import * as dayjs from 'dayjs';

config();

it('asserts correctly', () => {
  expect(true).toBe(true);
})

it('#getWorkLogs returns a valid response with issues', async () => {
  const client = new JiraClient(axios, new JiraCredentialsResolver());
  const result = await client.getWorkLogs(dayjs('2020-10-20').toDate(), dayjs('2020-10-20').toDate());

  expect(result.length).not.toBe(0);
})

it('#getIssuesInProgress returns a valid response with issues', async () => {
  const client = new JiraClient(axios, new JiraCredentialsResolver());
  const result = await client.getIssuesInProgress(dayjs('2020-10-20').toDate(), dayjs('2020-10-20').toDate());

  expect(result.data.issues.length).not.toBe(0);
})

// it('#logTime returns undefined', async () => {
//   const client = new JiraClient(axios, new JiraCredentialsResolver());
//   const result = await client.logTime({
//     seconds: 3 * 3600,
//     issueKey: 'KIT-215',
//     utc: dayjs('2020-10-28').toDate()
//   });

//   expect(result).toBe(undefined);
// })