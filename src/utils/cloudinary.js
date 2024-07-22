import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// Configuration
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => { 
    try {
        if (!localFilePath) return null;

        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            public_id: '',
            resource_type: 'auto'
        });
        //console.log('file is uploaded on cloudinary', uploadResult.url);
        fs.unlinkSync(localFilePath)
        return uploadResult;
    } catch (error) {
        console.log(error);
        fs.unlinkSync(localFilePath);  // Remove the locally saved temporary file as the upload operation got failed  
        return null;
    }
}

export { uploadOnCloudinary };
