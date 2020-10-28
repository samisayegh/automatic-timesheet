import {JiraCredentialsResolver} from './security/jira-credentials-resolver';
import {JiraClient} from './jira-client/jira-client';
import axios from 'axios';

const credentialResolver = new JiraCredentialsResolver();
const jiraClient = new JiraClient(axios, credentialResolver);

export { credentialResolver, jiraClient };