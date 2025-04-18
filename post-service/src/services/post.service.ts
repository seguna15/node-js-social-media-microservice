import { redis } from "@/config";
import { Post } from "@/models/Post.model";
import { postCreationData } from "@/utils";

export const createPost = async(post: postCreationData, id: string) => {
    const {title, content, media} = post;
    const result =  new Post({
        title,
        content,
        media,
        user: id
    })
    await result.save();
    return result;
}


export const getAllPosts = async (queryPage: number, queryLimit: number) => {
    const page = queryPage;
    const limit = queryLimit;
    const startIndex = (page - 1) * limit;

    const cacheKey = `posts:${page}:${limit}`;
    const cachedPosts = await redis.get(cacheKey);

    if(cachedPosts){
        return JSON.parse(cachedPosts);
    }
    
    const posts = await Post.find({}).sort({createdAt: -1}).skip(startIndex).limit(limit);

    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    const result = {
        posts,
        currentPage: page,
        totalPages,
        totalPosts,
    }
    await redis.setex(cacheKey, 300, JSON.stringify(result));
    return result;
}

export const getPostById = async (id: string) => {

    const cachedKey = `post:${id}`;
    const cachedPost = await redis.get(cachedKey);

    if(cachedPost){
        return JSON.parse(cachedPost);
    }

    const post = await Post.findById(id);

    if(!post){
        return null;
    }

    await redis.setex(cachedKey, 300, JSON.stringify(post));
    return post;
}


export const deletePost = async (id: string, userId: string) => {
    const post = await Post.findOneAndDelete({
        _id: id,
        user: userId
    });

    if(!post){
        return null;
    }

    return post;
}

    

