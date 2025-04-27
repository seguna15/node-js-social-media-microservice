import mongoose, {Schema, Document} from "mongoose";

export interface IComment extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema: Schema<IComment> = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);


//commentSchema.index({ postId: 1, userId: 1 }, { unique: true });
commentSchema.index({ createdAt: -1 });

const Comment = mongoose.model<IComment>("Comment", commentSchema);

export default Comment;