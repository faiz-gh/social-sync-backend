import AWS from 'aws-sdk';
import fs from 'fs';

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_DEFAULT_REGION,
});

const s3 = new AWS.S3();

/**
 * @function uploadToS3
 * @description Uploads a file to S3
 * @param {string} fileName - The name of the file to upload
 * @param {string} type - It can be company or user
 * @param {string} typeId - The companyId or profileId of the file to upload
 * @param {string} filePath - The path of the file to upload
 * @returns {Promise<string>} The url of the uploaded file
 */
export async function uploadToS3(fileName: string, type: string, typeId: string, filePath: fs.PathOrFileDescriptor): Promise<string> {
    return new Promise((resolve, reject) => {
        const fileContent = fs.readFileSync(filePath);

        const params = {
            Bucket: `nebe-account-images`,
            Key: `${type}/${process.env.DEPLOY_ENV}/${typeId}/${fileName}`,
            Body: fileContent,
        };

        s3.upload(params, (err: unknown, data: { Location: unknown; }) => {
            if (err) {
                console.error('Error uploading to S3:', err);
                reject(err);
            } else {
                console.log('Upload successful:', data.Location);
                resolve(data.Location as string);
            }
        });
    });
}
