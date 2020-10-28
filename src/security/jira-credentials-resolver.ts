export interface ICredentialsResolver {
    getApiToken() : string;
    getEmail() : string;
}

export class JiraCredentialsResolver implements ICredentialsResolver {
    getEmail(): string {
        return process.env.TIMESHEET_JIRA_EMAIL || 'ssayegh@coveo.com';
    }
    getApiToken() : string {
        return process.env.TIMESHEET_JIRA_API_KEY || 'tRAKKmfbDGvJxK2gdi2KE3B2';
    }
}