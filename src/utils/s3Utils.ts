import {GetObjectCommand, PutObjectCommand, S3Client} from "@aws-sdk/client-s3"
import {getSignedUrl} from "@aws-sdk/s3-request-presigner"

const {v4: uuidv4} = require("uuid")

const bucketName = process.env.BUCKET!
const s3Client = new S3Client({region: "us-west-2"})

async function uploadToS3(image: any) {
    if (!image) {
        return {
            statusCode: 400,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({message: "Missing 'fileFromUi' file in form-data"}),
        }
    }
    const fileName = randomFileName(image)
    // Create the param to upload the file in S3
    const uploadParams = {
        Bucket: bucketName,
        Key: fileName,
        Body: Buffer.from(image.content, "binary"),
        ContentType: image.contentType,
    }

    try {
        // Upload data to the specified bucket
        await s3Client.send(new PutObjectCommand(uploadParams))

        // Example to generate a signed URL to display the file in the front end :
        // const signedUrl = await getSignedUrl(
        //     s3Client,
        //     new GetObjectCommand({
        //         Bucket: bucketName,
        //         Key: fileName,
        //     }),
        //     { expiresIn: 600 } // 600 seconds = 10 minutes
        // )

        return {
            statusCode: 200,
            fileName,
            // signedUrl
        }
    } catch (err: any) {
        console.error("Error invoking S3:", err)
        return {
            statusCode: 500,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                message: "Failed to upload the file",
                error: err.message,
            }),
        }
    }
}


async function loadFromS3(filename: string) {
    const getObjectParams = {
        Bucket: bucketName,
        Key: filename
    };
    const {Body} = await s3Client.send(new GetObjectCommand(getObjectParams));
    const streamToBuffer = async (stream: any) => {
        const chunks = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        return Buffer.concat(chunks);
    };

    return await streamToBuffer(Body);
}

function randomFileName(image: any) {
    const filename = image.filename
    let fileParts = filename.split(".")
    let fileFormat = fileParts[fileParts.length - 1]
    return uuidv4() + "." + fileFormat
}

export {uploadToS3, loadFromS3}
