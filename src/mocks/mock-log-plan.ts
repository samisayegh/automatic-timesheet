import { LogPlan } from '../log-calculator/log-calculator';

export function buildLogPlan(config: Partial<LogPlan> = {}): LogPlan {
  return {
    logDate: new Date('2020-01-01'),
    logCommands: [],
    ...config
  }
}