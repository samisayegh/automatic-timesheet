import { LogPlan } from '../log-calculator/log-calculator';
import { Summary } from '../log-calculator/planner/planner';

export function buildLogPlan(config: Partial<LogPlan> = {}): LogPlan {
  return {
    logDate: new Date('2020-01-01'),
    commands: [],
    message: Summary.NoIssues,
    ...config
  }
}