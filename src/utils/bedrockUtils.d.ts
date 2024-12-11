declare function describePicture(image: any): Promise<{
    statusCode: number;
    productInfo: any;
    headers?: undefined;
    body?: undefined;
} | {
    statusCode: number;
    headers: {
        "Content-Type": string;
    };
    body: string;
    productInfo?: undefined;
}>;
export default describePicture;
