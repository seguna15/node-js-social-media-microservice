import mongoose, {Document, Schema} from "mongoose";

export interface IPost extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  content: string;
  media: mongoose.Types.ObjectId[];
  likes: number;
  comments: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}


const postSchema: Schema<IPost> = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, unique: true, trim: true },
    content: { type: String, required: true },
    media: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    likes: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
},{timestamps: true}) 

postSchema.index({title: "text", content: "text"})

export const Post = mongoose.model<IPost>("Post", postSchema);