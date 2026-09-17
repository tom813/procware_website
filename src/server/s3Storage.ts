import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

export interface S3Config {
  endpoint: string;
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucket: string;
  forcePathStyle: boolean;
}

let s3ClientInstance: S3Client | null = null;
let s3ConfigCache: S3Config | null = null;

export function getS3Config(): S3Config | null {
  const endpoint = (process.env.S3_ENDPOINT || "").trim();
  const accessKeyId = (process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || "").trim();
  const secretAccessKey = (
    process.env.S3_SECRET_ACCESS_KEY ||
    process.env.AWS_SECRET_ACCESS_KEY ||
    ""
  ).trim();
  const bucket = (
    process.env.S3_BUCKET ||
    process.env.S3_BUCKET_NAME ||
    process.env.GARAGE_BUCKET ||
    "procware-preview"
  ).trim();
  const region = (process.env.S3_REGION || process.env.AWS_REGION || "garage").trim();
  const forcePathStyle = process.env.S3_FORCE_PATH_STYLE !== "false"; // default true for Garage/Minio

  if (!endpoint && !accessKeyId) {
    return null;
  }

  return {
    endpoint,
    region,
    accessKeyId,
    secretAccessKey,
    bucket,
    forcePathStyle,
  };
}

export function getS3Client(): S3Client | null {
  if (s3ClientInstance) return s3ClientInstance;

  const config = getS3Config();
  if (!config || !config.endpoint) {
    return null;
  }

  s3ConfigCache = config;
  s3ClientInstance = new S3Client({
    endpoint: config.endpoint,
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
    forcePathStyle: config.forcePathStyle,
  });

  return s3ClientInstance;
}

/**
 * Check if the S3 / Garage connection is working and list available buckets
 */
export async function checkS3Connection(): Promise<{
  connected: boolean;
  endpoint: string;
  bucket: string;
  region: string;
  buckets?: string[];
  error?: string;
}> {
  const config = getS3Config();
  if (!config || !config.endpoint) {
    return {
      connected: false,
      endpoint: "Not configured",
      bucket: "Not configured",
      region: "Not configured",
      error: "S3_ENDPOINT is missing in environment variables.",
    };
  }

  if (!config.accessKeyId) {
    return {
      connected: false,
      endpoint: config.endpoint,
      bucket: config.bucket,
      region: config.region,
      error: "S3_ACCESS_KEY_ID (or AWS_ACCESS_KEY_ID) is missing in environment variables.",
    };
  }

  if (!config.secretAccessKey) {
    return {
      connected: false,
      endpoint: config.endpoint,
      bucket: config.bucket,
      region: config.region,
      error: "S3_SECRET_ACCESS_KEY (or AWS_SECRET_ACCESS_KEY) is missing in environment variables.",
    };
  }

  try {
    const client = getS3Client();
    if (!client) {
      throw new Error("Could not initialize S3Client.");
    }

    // Try global ListBuckets first
    try {
      const res = await client.send(new ListBucketsCommand({}));
      const bucketNames = (res.Buckets || []).map((b) => b.Name || "").filter(Boolean);

      return {
        connected: true,
        endpoint: config.endpoint,
        bucket: config.bucket,
        region: config.region,
        buckets: bucketNames,
      };
    } catch {
      // If ListBuckets is forbidden, test bucket-level access (ListObjectsV2)
      await client.send(new ListObjectsV2Command({ Bucket: config.bucket, MaxKeys: 1 }));
      return {
        connected: true,
        endpoint: config.endpoint,
        bucket: config.bucket,
        region: config.region,
        buckets: [config.bucket],
      };
    }
  } catch (err: any) {
    return {
      connected: false,
      endpoint: config.endpoint,
      bucket: config.bucket,
      region: config.region,
      error: err?.message || String(err),
    };
  }
}

/**
 * Upload a file/buffer to S3 / Garage bucket
 */
export async function uploadFileToS3(params: {
  key: string;
  buffer: Buffer;
  contentType?: string;
  metadata?: Record<string, string>;
}): Promise<{ success: boolean; key: string; url: string; size: number }> {
  const client = getS3Client();
  const config = getS3Config();

  if (!client || !config) {
    throw new Error("S3 storage client is not configured.");
  }

  const cleanKey = params.key.replace(/^\/+/, "");
  const contentType = params.contentType || "application/octet-stream";

  await client.send(
    new PutObjectCommand({
      Bucket: config.bucket,
      Key: cleanKey,
      Body: params.buffer,
      ContentType: contentType,
      Metadata: params.metadata,
    })
  );

  // Return formatted URL
  const publicUrl = `${config.endpoint.replace(/\/+$/, "")}/${config.bucket}/${cleanKey}`;

  return {
    success: true,
    key: cleanKey,
    url: publicUrl,
    size: params.buffer.length,
  };
}

/**
 * Download a file from S3 / Garage bucket
 */
export async function getFileFromS3(key: string): Promise<{
  buffer: Buffer;
  contentType: string;
  contentLength?: number;
} | null> {
  const client = getS3Client();
  const config = getS3Config();

  if (!client || !config) {
    return null;
  }

  const cleanKey = key.replace(/^\/+/, "");

  try {
    const res = await client.send(
      new GetObjectCommand({
        Bucket: config.bucket,
        Key: cleanKey,
      })
    );

    if (!res.Body) return null;

    // Convert stream to Buffer
    const streamToBuffer = async (stream: any): Promise<Buffer> => {
      return new Promise((resolve, reject) => {
        const chunks: any[] = [];
        stream.on("data", (chunk: any) => chunks.push(chunk));
        stream.on("error", reject);
        stream.on("end", () => resolve(Buffer.concat(chunks)));
      });
    };

    const buffer = await streamToBuffer(res.Body);
    return {
      buffer,
      contentType: res.ContentType || "application/octet-stream",
      contentLength: res.ContentLength,
    };
  } catch (err: any) {
    if (err.name === "NoSuchKey" || err.$metadata?.httpStatusCode === 404) {
      return null;
    }
    throw err;
  }
}

/**
 * Delete an object from S3 / Garage bucket
 */
export async function deleteFileFromS3(key: string): Promise<boolean> {
  const client = getS3Client();
  const config = getS3Config();

  if (!client || !config) return false;

  const cleanKey = key.replace(/^\/+/, "");
  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: config.bucket,
        Key: cleanKey,
      })
    );
    return true;
  } catch (err) {
    console.error("Error deleting file from S3:", err);
    return false;
  }
}

/**
 * List files from S3 / Garage bucket
 */
export async function listFilesFromS3(prefix?: string): Promise<
  Array<{ key: string; size: number; lastModified?: Date }>
> {
  const client = getS3Client();
  const config = getS3Config();

  if (!client || !config) return [];

  try {
    const res = await client.send(
      new ListObjectsV2Command({
        Bucket: config.bucket,
        Prefix: prefix ? prefix.replace(/^\/+/, "") : undefined,
      })
    );

    return (res.Contents || []).map((item) => ({
      key: item.Key || "",
      size: item.Size || 0,
      lastModified: item.LastModified,
    }));
  } catch (err) {
    console.error("Error listing files from S3:", err);
    return [];
  }
}
