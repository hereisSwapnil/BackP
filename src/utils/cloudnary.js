import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
});

async function uploadOnCloudnary(localFilePath) {
    try {
        if (!localFilePath) return null;
        // upload file 
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // file has been uploaded
        console.log("The file has been uploaded ", response.url);
        return response
    } catch (error) {
        // this will unlink the locally saved file as upload got failed
        fs.unlink(localFilePath)
    }
}

export default uploadOnCloudnary