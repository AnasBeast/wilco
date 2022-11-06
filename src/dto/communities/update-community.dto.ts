import { BaseCommunity } from './base-community.dto';

export class UpdateCommunityDto extends BaseCommunity {
  completedAt: Date;
}
