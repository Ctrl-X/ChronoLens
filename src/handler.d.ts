declare const handler: (event: any, context: any) => Promise<{
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
} | {
    statusCode: number;
    employeeInfo: string;
    headers?: undefined;
    body?: undefined;
} | {
    statusCode: number;
    headers: {
        "Content-Type": string;
    };
    body: string;
    employeeInfo?: undefined;
} | {
    statusCode: number;
    timesheetInfo: string;
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
