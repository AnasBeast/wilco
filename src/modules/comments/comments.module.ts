import { forwardRef, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "src/database/mongo/models/comment.model";
import { CommentReply, CommentReplySchema } from "src/database/mongo/models/commentReply.model";
import { PostsModule } from "../posts/posts.module";
import { CommentController } from "./comments.controller";
import { CommentService } from "./comments.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Comment.name, schema: CommentSchema },
            { name: CommentReply.name, schema: CommentReplySchema }
        ]),
        forwardRef(() => PostsModule),      
    ],
    controllers: [CommentController],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentsModule {}