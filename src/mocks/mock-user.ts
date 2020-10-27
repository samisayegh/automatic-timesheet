import {User} from '../jira-client/jira-client';

export function buildMockUser(config: Partial<User> = {}): User {
  return {
    accountId: '',
    accountType: '',
    active: false,
    avatarUrls: {},
    displayName: '',
    emailAddress: '',
    locale: '',
    self: '',
    ...config
  }
}