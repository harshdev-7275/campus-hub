import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY || "",
    secretAccessKey:
      process.env.AWS_S3_SECRET_KEY ||
      "",
  },
});
