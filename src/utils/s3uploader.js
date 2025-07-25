const { S3Client } = require('@aws-sdk/client-s3');

const config = {
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.ACCESSKEY,
        secretAccessKey: process.env.SECRETACCESSKEY
    }
}
const s3 = new S3Client(config);

module.exports = s3;