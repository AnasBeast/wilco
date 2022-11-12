import { BaseLike } from './base-like.dto';

export class UpdateLikeDto extends BaseLike {
  completedAt: Date;
}
