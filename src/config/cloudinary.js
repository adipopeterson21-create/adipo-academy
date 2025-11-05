const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    let folder = 'adipo_academy/media';
    if (file.mimetype.startsWith('image/')) folder = folder + '/images';
    else if (file.mimetype.startsWith('video/')) folder = folder + '/videos';
    else if (file.mimetype.startsWith('audio/')) folder = folder + '/audio';
    else if (file.mimetype === 'application/pdf') folder = folder + '/pdfs';
    return { folder, resource_type: 'auto' };
  }
});

module.exports = { cloudinary, storage };
