import { Media } from "@/models/Media.model";

interface ICreateMedia {
    publicId: string;
    originalName: string;
    mimeType: string;
    url: string;
    userId: string;
  }

export const createMedia = async (payload: ICreateMedia) => {
    const {publicId, originalName, mimeType, url, userId} = payload;
    
    const newMedia = new Media({
      publicId,
      originalName,
      mimeType,
      url,
      userId,
    });

    await newMedia.save();
    return newMedia;
}


export const fetchAll = async() => {
   const result = await Media.find();
   return result;
}



