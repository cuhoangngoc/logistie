import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getPublicIdFromUrl = (url) => {
  // const regex = /\/v\d+\/([^/]+)\.\w{3,4}$/;
  const regex = /\/([^/]+\/[^/]+)\.\w{3,4}$/;
  const match = url.match(regex);
  return match ? match[1] : null;
};

export { cloudinary, getPublicIdFromUrl };
