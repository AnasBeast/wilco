import { Module } from "@nestjs/common";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { Connection } from "mongoose";
import { Notification, NotificationSchema } from "src/database/mongo/models/notification.model";
import * as AutoIncrementFactory from "mongoose-sequence";
import { NotificationsService } from "./notifications.service";
import { NotificationType } from "src/database/mongo/models/notification_type.model";

@Module({
    imports: [MongooseModule.forFeatureAsync([
        {
            name: Notification.name,
            useFactory: (connection: Connection) => {
                const schema = NotificationSchema;
                const autoIncrement = AutoIncrementFactory(connection);
                schema.plugin(autoIncrement, { id: "notification_id_autoincrement", inc_field: 'id', start_seq: 4008 });
                return schema;
            },
            inject: [getConnectionToken()]
        },
        {
            name: NotificationType.name,
            useFactory: (connection: Connection) => {
                const schema = NotificationSchema;
                const autoIncrement = AutoIncrementFactory(connection);
                schema.plugin(autoIncrement, { id: "notification_type_id_autoincrement", inc_field: 'id', start_seq: 6 });
                return schema;
            },
            inject: [getConnectionToken()]
        }
    ])],
    providers: [NotificationsService],
    exports: [NotificationsService]
})
export class NotificationsModule {}