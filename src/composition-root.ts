import {JiraCredentialsResolver} from './security/jira-credentials-resolver';
import {JiraClient} from './jira-client/jira-client';
import axios from 'axios';

const CredentialResolver = new JiraCredentialsResolver();
const JiraClientImpl = new JiraClient(axios, CredentialResolver);

export { CredentialResolver, JiraClientImpl as JiraClient };