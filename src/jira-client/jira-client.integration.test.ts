import {JiraClient} from './jira-client';
import axios from 'axios';
import {writeFileSync} from 'fs';

it('#getIssuesInProgress returns a valid response with issues', async () => {
  const client = new JiraClient(axios);
  const result = await client.getIssuesInProgress();
//   writeFileSync('dump.json', JSON.stringify(result.data), {
//       encoding: 'utf8'
//   })

  expect(result.data).toMatchObject({
    issues: []
  })
})

it('#getUsers return users', async () => {
    const apiToken = 'dozjnowL7RTrlOPaqLvQDFFF';
    const auth = Buffer.from(`fguerreiro@coveo.com:${apiToken}`).toString('base64');
    // const query = "assignee = 'Sami Sayegh' and status = 'in progress' order by created DESC";
    const headers = {
      'Authorization': `Basic ${auth}`,
      'Accept': 'application/json'
    }

    const response = await axios.get(`https://coveord.atlassian.net/rest/api/3/users/search`, {headers})

    writeFileSync('all-users.json', JSON.stringify(response.data), {
        encoding: 'utf8'
    })

    console.log(`Response: ${response.status} ${response.statusText}`);
    expect(response.status).toBe(200);

    // console.log(response.data)
    // return response.text();

    // .then(text => console.log(text))
    // .catch(err => console.error(err));
})