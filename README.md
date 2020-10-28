# automatic-timesheet

A tool to automatically log your time.

## Getting Started

You will need to have node and npm installed. You can [download it here](https://nodejs.org/en/download/). Once ready,

1. Clone the repo.
2. Install dependencies: `npm i`
3. In the `.env` file, add your Coveo email, and a Jira token that [can be generated here](https://id.atlassian.com/manage-profile/security/api-tokens).
4. Run the command to log time: `npm run log`



This project is intended to be used with the latest Active LTS release of [Node.js][nodejs].

## Available Scripts

- `clean` - remove coverage data, Jest cache and transpiled files,
- `build` - transpile TypeScript to ES6,
- `build:watch` - interactive watch mode to automatically transpile source files,
- `lint` - lint source files and tests,
- `test` - run tests,
- `test:watch` - interactive watch mode to automatically re-run tests