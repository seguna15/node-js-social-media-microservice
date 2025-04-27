import Comment from "@/models/Comment.model"
import { commentCreationData } from "@/utils"



export const createComment = async (data: commentCreationData) => {
    const response = await Comment.create(data);
    return response;
}


export const getPostComments = async (postId: string) => {
    const response = await Comment.find({ postId });
    return response;
}
