import { BasePost } from './base-post.dto';

export class UpdatePostDto extends BasePost {
  completedAt: Date;
}
