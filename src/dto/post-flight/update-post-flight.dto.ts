import { BasePostFlight } from './base-post-flight.dto';

export class UpdatePostFlightDto extends BasePostFlight {
  completedAt: Date;
}
