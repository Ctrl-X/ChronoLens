declare function getEmployeeList(file: any): Promise<{
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
}>;
declare function getEmployeeTimesheet(file: any, employee_name: string, employee_id: string): Promise<{
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
}>;
export { getEmployeeTimesheet, getEmployeeList };
