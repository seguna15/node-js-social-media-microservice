import { redis } from "@/config";

export  const invalidateCache = async (id?: string) => {
    const cachedKey = `post:${id}`;
    await redis.del(cachedKey);

    const keys = await redis.keys(`posts:*`);
    if(keys.length > 0){
         await redis.del(keys);
    }
   
  };
  

