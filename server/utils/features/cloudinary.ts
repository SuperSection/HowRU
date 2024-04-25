import { v2 as cloudinary } from "cloudinary";
import { getBase64 } from "../helper";
import { v4 as uuid } from "uuid";


const uploadFilesToCloudinary = async (files: any) => {

  const uploadFiles = files.map(async (file: any) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) reject(error);
          resolve(result);
        },
      );
    });
  });
    
    try {
      const uploadedFiles = await Promise.all(uploadFiles);

      const formattedFiles = uploadedFiles.map((result: any) => {
        return {
          public_id: result.public_id,
          url: result.secure_url,
        };
      });
        
      return formattedFiles;
    } catch (error: any) {
        throw new Error("Error uploading files to Cloudinary.", error);
    }
};


const deleteFilesFromCloudinary = (public_ids: string[]) => {};


export { uploadFilesToCloudinary, deleteFilesFromCloudinary };