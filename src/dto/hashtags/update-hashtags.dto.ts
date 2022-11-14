import { BaseHashtags } from './base-hashtags.dto';

export class UpdateHashtagsDto extends BaseHashtags {
  completedAt: Date;
}
