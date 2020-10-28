export interface ICredentialsResolver {
    getApiToken() : string;
    getEmail() : string;
}

export class JiraCredentialsResolver implements ICredentialsResolver {
    getEmail(): string {
        return process.env.TIMESHEET_JIRA_EMAIL || '';
    }
    getApiToken() : string {
        return process.env.TIMESHEET_JIRA_API_KEY || '';
    }
}