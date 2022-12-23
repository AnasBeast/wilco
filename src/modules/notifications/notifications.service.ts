import { Inject, Injectable, forwardRef } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationDocument } from "src/database/mongo/models/notification.model";
import { PilotsService } from "../pilots/pilots.service";
import { PostsService } from "../posts/posts.service";
import { CommentService } from "../comments/comments.service";

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

    async pushNotification(notifiable_type: string, notifiable_id: number, pilot_id: number, notification_type_id: number) {
        return await this.notificationModel.create({ notifiable_type, notifiable_id, pilot_id, notification_type_id })
    }

    async getUnreadNumber(pilot_id) {
        const number_of_unread = await this.notificationModel.find({ pilot_id, readed: false }).count();
        return { number_of_unread };
    }

    async getNotifications(pilot_id: number, page: number, per_page: number) {
        const data = await this.notificationModel.find({ pilot_id }, {}, { skip: (page - 1) * per_page, limit: per_page }).sort({ created_at: -1 }).lean();
        const count = await this.notificationModel.find({ pilot_id }).count();
        const pages = Math.ceil(count / per_page);
        return {
            data,
            pagination: {
                current: page,
                pages: pages,
                first_page: page === 1,
                last_page: page === pages || pages === 0
            },
        }
    }
}