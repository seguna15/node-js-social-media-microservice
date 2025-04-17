import mongoose, { Document, Schema } from "mongoose";
import argon2 from "argon2";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  lastLogin?: Date;
  comparePassword(userPassword: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  lastLogin: { type: Date, default: null },
}, {timestamps: true})

userSchema.pre("save", async function (next) {
    if(this.isModified("password")) {
        try {
            this.password = await argon2.hash(this.password);
        } catch (error) {
            return next(error as Error)
        }
    }
})


userSchema.methods.comparePassword = async function (userPassword: string): Promise<boolean> {
    try {
        return await argon2.verify(this.password, userPassword);
    } catch (error) {
        throw error;
    }
}

//index
userSchema.index({username: "text", email: "text"})

export const User = mongoose.model<IUser>("User", userSchema);