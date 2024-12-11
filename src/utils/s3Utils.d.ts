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
export default uploadToS3;
