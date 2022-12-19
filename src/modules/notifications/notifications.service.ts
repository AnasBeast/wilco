import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Notification, NotificationDocument } from "src/database/mongo/models/notification.model";

@Injectable()
export class NotificationsService {
    constructor(@InjectModel(Notification.name) private notificationModel: Model<NotificationDocument>) {}

    async pushNotification(notifiable_type: string, notifiable_id: number, pilot_id: number, notification_type_id: number) {
        return await this.notificationModel.create({ notifiable_type, notifiable_id, pilot_id, notification_type_id })
    }
}