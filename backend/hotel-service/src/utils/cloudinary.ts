import cloudinary from "cloudinary";

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadImages = async (imageFiles: Express.Multer.File[]) => {
    const uploadPromises = imageFiles.map(async (img) => {
        const b64 = Buffer.from(img.buffer).toString("base64");
        let dataURI = "data:" + img.mimetype + ";base64," + b64;
        const res = await cloudinary.v2.uploader.upload(dataURI);
        return res.url;
    });

    const imageURLs = await Promise.all(uploadPromises);
    return imageURLs;
};

export default cloudinary;
