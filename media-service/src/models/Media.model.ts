import mongoose, {Document, Schema} from "mongoose";

export interface IMedia extends Document {
  publicId: string;
  originalName: string;
  mimeType: string;
  url: string;
  userId: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}


const mediaSchema: Schema<IMedia> = new Schema(
  {
    publicId: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
); 


export const Media = mongoose.model<IMedia>("Media", mediaSchema);