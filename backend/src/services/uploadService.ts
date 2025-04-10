import {
    S3Client,
    PutObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import mime from "mime-types";

const s3 = new S3Client({ region: "sa-east-1" }); // ajuste a região se necessário

const BUCKET_NAME = "preventix-pdf-upload";

export async function uploadPdf(fileBuffer: Buffer, originalName: string): Promise<string> {
    const key = `pdfs/${uuidv4()}-${originalName}`;
    const contentType = mime.lookup(originalName) || "application/pdf";

    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: "public-read",
    });

    await s3.send(command);

    return `https://${BUCKET_NAME}.s3.amazonaws.com/${key}`;
}
