import { Media } from "@/models/Media.model";
import { deleteMediaFromCloudinary } from "@/utils";
import { logger } from "@/utils";

interface DeletePostEvent {
    postId: string;
    userId: string;
    media: string[];
}

export const handleDeletePost = async(event: DeletePostEvent) => {
    const {postId, media} = event;
    
    try {
        const mediaToDelete = await Media.find({
            _id: {$in: media}
        })

        for (const media of mediaToDelete){
            await deleteMediaFromCloudinary(media.publicId);
            await Media.findByIdAndDelete(media._id);
            logger.info(`Deleted media with publicId: ${media.publicId} associated with postId ${postId}`)
        }
    } catch (error) {
        logger.error(`Error occurred during media deletion: ${error} `)
    }
}