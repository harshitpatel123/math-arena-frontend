import API from './api';

export const uploadToS3 = async (file) => {
  try {
    const { data } = await API.post('/auth/upload-url', {
      fileName: file.name,
      fileType: file.type
    });
    
    const { uploadUrl, fileUrl } = data;
    
    await fetch(uploadUrl, {
      method: 'PUT',
      body: file
    });
    
    console.log(`✅ Image uploaded to S3: ${fileUrl}`);
    return fileUrl;
  } catch (error) {
    console.error(`❌ S3 upload failed:`, error.message);
    throw error;
  }
};
