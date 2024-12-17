/// <reference types="node" />
/// <reference types="node" />
declare function uploadToS3(image: any): Promise<{
    statusCode: number;
    headers: {
        "Content-Type": string;
    };
    body: string;
    fileName?: undefined;
} | {
    statusCode: number;
    fileName: string;
    headers?: undefined;
    body?: undefined;
}>;
declare function loadFromS3(filename: string): Promise<Buffer>;
export { uploadToS3, loadFromS3 };
