import { BasePilot } from './base-pilot.dto';

export class UpdatePilotDto extends BasePilot {
  completedAt: Date;
}
