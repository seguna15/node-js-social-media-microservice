import mongoose, {Schema, Document} from "mongoose";

export interface ISearch extends Document {
  postId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const searchSchema: Schema<ISearch> = new Schema({
  postId: { type: Schema.Types.ObjectId, ref: "Post", required: true },
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true , index: true },
  title: { type: String, required: true, unique: true, trim: true },
  content: { type: String, required: true },
},{timestamps: true});


searchSchema.index({content: 'text'})
searchSchema.index({title: 'text'})
searchSchema.index({createdAt: -1})

const Search = mongoose.model<ISearch>("Search", searchSchema);

export default Search;