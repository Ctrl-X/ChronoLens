declare const handler: (event: any, context: any) => Promise<{
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
} | {
    statusCode: number;
    headers: {
        "Access-Control-Allow-Origin": string;
        "Content-Type": string;
    };
    body: string;
}>;
export { handler };
