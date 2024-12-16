declare const handler: (event: any, context: any) => Promise<{
    statusCode: number;
    employeeInfo: string | undefined;
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
    timesheetInfo: import("@aws-sdk/client-bedrock-runtime").Message | undefined;
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
