
import Comment from "@/models/Comment.model";
import { logger } from "@/utils";


interface IDeletePostEvent {
    postId: string;
}


export const handleDelete = async (event: IDeletePostEvent) =>{
    const { postId } = event;
    try {
        await Comment.deleteMany({ postId });
        logger.info(`Comments post deleted for post ID: ${postId}`)   
    }catch(error){
        logger.error(`Error occurred during search post deletion: ${error}`)
    }
}


