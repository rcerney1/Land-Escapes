const s3 = require('./config/aws');

const bucketName = process.env.AWS_S3_BUCKET;

s3.listObjects({ Bucket: bucketName }, (err, data) => {
    if (err) {
        console.error('Error connecting to S3:', err.message);
    } else {
        console.log('S3 Bucket Contents:', data);
    }
});
