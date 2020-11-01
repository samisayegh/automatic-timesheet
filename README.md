# automatic-timesheet

A tool that automatically fills your timesheet based on your commits.

## Setup

You will need to have node and npm installed. You can [download it here](https://nodejs.org/en/download/). Once ready,

1. Clone the repo.
2. Setup the project: `npm run setup`
3. In the `.env` file, add your Coveo email, and a Jira token that [can be generated here](https://id.atlassian.com/manage-profile/security/api-tokens).


## Logging time

To log time for current day, run:

```
npm run log
```

Alternatively, pass a date formatted as `YYYY-MM-DD` to log time for a previous day.

```
npm run log -- 2020-10-23
```

Pass a start and end date to log time for a range of dates, inclusive. No time will be logged on weekends.

```
npm run log -- 2020-10-23 2020-10-26
```

To automate the process, set up a cron-job on your computer to run at the end of your working day (e.g. 5pm).


## Available Scripts

- `npm run log` - Logs time.
- `npm run create:config` - Generates an `.env` file if it does not already exist.
- `npm run build` - transpiles TypeScript to JavasScript.


## Limitations

- Ensure the target day has no time logged. The initial version of the tool will always try to log 8 hours of time.
- When specifying a day, pick one within the last 7 days for reproducible results. Older days will work on the first run, but may give different results on subsequent attempts as Jiras are updated and reordered.
- The tool will log a maximum of 2 jiras for a day, assigning 4 hours to each.
- The tool uses commits as proof-of-work. If you do not use git commits as part of your job, the tool will not find your associated jiras.