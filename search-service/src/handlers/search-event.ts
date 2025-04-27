
import Search from "@/models/Search.model";
import { logger } from "@/utils";

interface ICreatePostEvent {
    postId: string;
    userId: string;
    title: string;
    content: string;
   createdAt: Date;
}

interface IDeletePostEvent {
    postId: string;
}

export const handleCreate = async (event: ICreatePostEvent) => {
  const { postId, userId, title, content, createdAt } = event;

  try {
    const newSearchPost  = new Search({
      postId,
      userId,
      title,
      content,
      createdAt,
    });

    await newSearchPost.save()


    logger.info(`Search post created: ${postId}: ${newSearchPost?._id?.toString()}`)
  } catch (error) {
    logger.error(`Error occurred during search post creation: ${error} `);
  }
};

export const handleDelete = async (event: IDeletePostEvent) =>{
    const { postId } = event;
    try {
        await Search.findOneAndDelete({postId})
        logger.info(`Search post deleted for post ID: ${postId}`)   
    }catch(error){
        logger.error(`Error occurred during search post deletion: ${error}`)
    }
}