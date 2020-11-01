import { LogCommand } from '../log-calculator/planner/planner';

export function buildLogCommand(config: Partial<LogCommand> = {}): LogCommand {
  return {
    issueKey: '',
    seconds: 0,
    ...config
  }
}