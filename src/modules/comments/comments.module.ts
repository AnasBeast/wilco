import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule, getConnectionToken } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "src/database/mongo/models/comment.model";
import { CommentReply, CommentReplySchema } from "src/database/mongo/models/commentReply.model";
import { PostsModule } from "../posts/posts.module";
import { CommentController } from "./comments.controller";
import { CommentService } from "./comments.service";
import { Connection } from "mongoose";
import * as AutoIncrementFactory from "mongoose-sequence";
import { CommentLike, CommentLikeSchema } from "src/database/mongo/models/comment-like.model";
import { CommentDislike, CommentDislikeSchema } from "src/database/mongo/models/comment-dislike.model";

@Module({
    imports: [
        MongooseModule.forFeatureAsync([
            { 
                name: Comment.name, 
                useFactory: (connection: Connection) => {
                    const schema = CommentSchema;
                    const autoIncrement = AutoIncrementFactory(connection);
                    schema.plugin(autoIncrement, { id: 'comment_id_autoincrement', inc_field: 'id', start_seq: 291 });
                    return schema;
                },
                inject: [getConnectionToken()]
            },
            { 
                name: CommentReply.name, 
                useFactory: (connection: Connection) => {
                    const schema = CommentReplySchema;
                    const autoIncrement = AutoIncrementFactory(connection);
                    schema.plugin(autoIncrement, { id: 'comment_reply_id_autoincrement', inc_field: 'id' });
                    return schema;
                },
                inject: [getConnectionToken()] 
            },
            { 
                name: CommentLike.name, 
                useFactory: (connection: Connection) => {
                    const schema = CommentLikeSchema;
                    const autoIncrement = AutoIncrementFactory(connection);
                    schema.plugin(autoIncrement, { id: 'comment_like_id_autoincrement', inc_field: 'id' });
                    return schema;
                },
                inject: [getConnectionToken()] 
            },
            { 
                name: CommentDislike.name, 
                useFactory: (connection: Connection) => {
                    const schema = CommentDislikeSchema;
                    const autoIncrement = AutoIncrementFactory(connection);
                    schema.plugin(autoIncrement, { id: 'comment_dislike_id_autoincrement', inc_field: 'id' });
                    return schema;
                },
                inject: [getConnectionToken()] 
            }
        ]),
        forwardRef(() => PostsModule),      
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentsModule {}