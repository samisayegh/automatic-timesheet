import { LogPlan } from '../log-calculator/log-calculator';
import { buildPlan } from './mock-plan';

export function buildLogPlan(config: Partial<LogPlan> = {}): LogPlan {
  return {
    logDate: new Date('2020-01-01'),
    plan: buildPlan(),
    ...config
  }
}