/// <reference types="node" />
/// <reference types="node" />
declare function getEmployeeList(file: any): Promise<{
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
}>;
declare function getEmployeeTimesheet(filename: string, buffer: Buffer, employee_name: string, employee_id: string): Promise<{
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
}>;
export { getEmployeeTimesheet, getEmployeeList };
