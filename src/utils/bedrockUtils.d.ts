declare function describePicture(file: any): Promise<{
    statusCode: number;
    timesheetInfo: any;
    headers?: undefined;
    body?: undefined;
} | {
    statusCode: number;
    headers: {
        "Content-Type": string;
    };
    body: string;
    timesheetInfo?: undefined;
}>;
export default describePicture;
