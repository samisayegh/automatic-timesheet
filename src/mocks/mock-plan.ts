import { Plan, Summary } from '../log-calculator/planner/planner';

export function buildPlan(config: Partial<Plan> = {}): Plan {
  return {
    commands: [],
    message: Summary.NoIssues,
    ...config
  }
}