"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const multipart = require("aws-lambda-multipart-parser");
const s3Utils_1 = require("./utils/s3Utils");
const bedrockUtils_1 = require("./utils/bedrockUtils");
const handler = async function (event, context) {
    let statusCode = 400;
    let bodyResult = null;
    try {
        let method = event.httpMethod;
        console.log("method", method);
        if (method != "POST" || event.path !== "/") {
            // We only accept POST
            bodyResult = "We only accept POST";
        }
        else {
            // parse the base64 from the API Gateway
            const base64Body = event.body;
            const buff = Buffer.from(base64Body, "base64");
            const decodedEventBody = buff.toString("latin1");
            const decodedEvent = { ...event, body: decodedEventBody };
            const formObject = multipart.parse(decodedEvent, false);
            // Get employee info from POST parameters
            const employeeName = formObject.employee_name;
            const employeeId = formObject.employee_id;
            if (!employeeName || !employeeId) {
                // if no specific employee is provided, we need to extract them from the file
                // fileFromUi is the form-data key associated to the file in the multipart
                const tmpFile = formObject.fileFromUi;
                // Uploading the file in S3
                const s3result = await (0, s3Utils_1.uploadToS3)(tmpFile);
                const { fileName } = s3result;
                if (s3result.statusCode !== 200) {
                    return s3result; // failed to upload to s3
                }
                // we get the list of all employees from the uploaded picture
                const result = await (0, bedrockUtils_1.getEmployeeList)(tmpFile);
                statusCode = result.statusCode;
                if (result.statusCode !== 200) {
                    return result; // failed to call bedrock
                }
                bodyResult = {
                    employeeList: result.employeeInfo,
                    fileName,
                };
            }
            else {
                // Get timesheets for the specified employee
                const s3Filename = formObject.s3Filename;
                const fileBuffer = await (0, s3Utils_1.loadFromS3)(s3Filename);
                const bedRockResult = await (0, bedrockUtils_1.getEmployeeTimesheet)(s3Filename, fileBuffer, employeeName, employeeId);
                statusCode = bedRockResult.statusCode;
                if (bedRockResult.statusCode === 200) {
                    bodyResult = {
                        timesheetInfo: bedRockResult.timesheetInfo,
                    };
                }
                else {
                    return bedRockResult;
                }
            }
        }
    }
    catch (error) {
        if (error instanceof Error) {
            bodyResult = error.stack;
        }
        else {
            bodyResult = error;
        }
    }
    const result = {
        statusCode,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyResult),
    };
    console.log("final result", result);
    return result;
};
exports.handler = handler;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFFekQsNkNBQXlEO0FBQ3pELHVEQUE2RTtBQUU3RSxNQUFNLE9BQU8sR0FBRyxLQUFLLFdBQVcsS0FBVSxFQUFFLE9BQVk7SUFDdEQsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztJQUV0QixJQUFJLENBQUM7UUFDSCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLElBQUksTUFBTSxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQzNDLHNCQUFzQjtZQUN0QixVQUFVLEdBQUcscUJBQXFCLENBQUM7UUFDckMsQ0FBQzthQUFNLENBQUM7WUFDTix3Q0FBd0M7WUFDeEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUM5QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakQsTUFBTSxZQUFZLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV4RCx5Q0FBeUM7WUFDekMsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUM5QyxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO1lBRTFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDakMsNkVBQTZFO2dCQUM3RSwwRUFBMEU7Z0JBQzFFLE1BQU0sT0FBTyxHQUFHLFVBQVUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3RDLDJCQUEyQjtnQkFDM0IsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLG9CQUFVLEVBQUMsT0FBTyxDQUFDLENBQUM7Z0JBQzNDLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxRQUFRLENBQUM7Z0JBQzlCLElBQUksUUFBUSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEMsT0FBTyxRQUFRLENBQUMsQ0FBQyx5QkFBeUI7Z0JBQzVDLENBQUM7Z0JBRUQsNkRBQTZEO2dCQUM3RCxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsOEJBQWUsRUFBQyxPQUFPLENBQUMsQ0FBQztnQkFDOUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7Z0JBQy9CLElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDOUIsT0FBTyxNQUFNLENBQUMsQ0FBQyx5QkFBeUI7Z0JBQzFDLENBQUM7Z0JBQ0QsVUFBVSxHQUFHO29CQUNYLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtvQkFDakMsUUFBUTtpQkFDVCxDQUFDO1lBQ0osQ0FBQztpQkFBTSxDQUFDO2dCQUNOLDRDQUE0QztnQkFDNUMsTUFBTSxVQUFVLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztnQkFDekMsTUFBTSxVQUFVLEdBQUcsTUFBTSxJQUFBLG9CQUFVLEVBQUMsVUFBVSxDQUFDLENBQUM7Z0JBQ2hELE1BQU0sYUFBYSxHQUFHLE1BQU0sSUFBQSxtQ0FBb0IsRUFDOUMsVUFBVSxFQUNWLFVBQVUsRUFDVixZQUFZLEVBQ1osVUFBVSxDQUNYLENBQUM7Z0JBQ0YsVUFBVSxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUM7Z0JBRXRDLElBQUksYUFBYSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDckMsVUFBVSxHQUFHO3dCQUNYLGFBQWEsRUFBRSxhQUFhLENBQUMsYUFBYTtxQkFDM0MsQ0FBQztnQkFDSixDQUFDO3FCQUFNLENBQUM7b0JBQ04sT0FBTyxhQUFhLENBQUM7Z0JBQ3ZCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFLENBQUM7WUFDM0IsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0IsQ0FBQzthQUFNLENBQUM7WUFDTixVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUc7UUFDYixVQUFVO1FBQ1YsT0FBTyxFQUFFO1lBQ1AsNkJBQTZCLEVBQUUsR0FBRztZQUNsQyxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DO1FBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO0tBQ2pDLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFTywwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG11bHRpcGFydCA9IHJlcXVpcmUoXCJhd3MtbGFtYmRhLW11bHRpcGFydC1wYXJzZXJcIik7XG5cbmltcG9ydCB7IHVwbG9hZFRvUzMsIGxvYWRGcm9tUzMgfSBmcm9tIFwiLi91dGlscy9zM1V0aWxzXCI7XG5pbXBvcnQgeyBnZXRFbXBsb3llZVRpbWVzaGVldCwgZ2V0RW1wbG95ZWVMaXN0IH0gZnJvbSBcIi4vdXRpbHMvYmVkcm9ja1V0aWxzXCI7XG5cbmNvbnN0IGhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQ6IGFueSwgY29udGV4dDogYW55KSB7XG4gIGxldCBzdGF0dXNDb2RlID0gNDAwO1xuICBsZXQgYm9keVJlc3VsdCA9IG51bGw7XG5cbiAgdHJ5IHtcbiAgICBsZXQgbWV0aG9kID0gZXZlbnQuaHR0cE1ldGhvZDtcbiAgICBjb25zb2xlLmxvZyhcIm1ldGhvZFwiLCBtZXRob2QpO1xuICAgIGlmIChtZXRob2QgIT0gXCJQT1NUXCIgfHwgZXZlbnQucGF0aCAhPT0gXCIvXCIpIHtcbiAgICAgIC8vIFdlIG9ubHkgYWNjZXB0IFBPU1RcbiAgICAgIGJvZHlSZXN1bHQgPSBcIldlIG9ubHkgYWNjZXB0IFBPU1RcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gcGFyc2UgdGhlIGJhc2U2NCBmcm9tIHRoZSBBUEkgR2F0ZXdheVxuICAgICAgY29uc3QgYmFzZTY0Qm9keSA9IGV2ZW50LmJvZHk7XG4gICAgICBjb25zdCBidWZmID0gQnVmZmVyLmZyb20oYmFzZTY0Qm9keSwgXCJiYXNlNjRcIik7XG4gICAgICBjb25zdCBkZWNvZGVkRXZlbnRCb2R5ID0gYnVmZi50b1N0cmluZyhcImxhdGluMVwiKTtcbiAgICAgIGNvbnN0IGRlY29kZWRFdmVudCA9IHsgLi4uZXZlbnQsIGJvZHk6IGRlY29kZWRFdmVudEJvZHkgfTtcbiAgICAgIGNvbnN0IGZvcm1PYmplY3QgPSBtdWx0aXBhcnQucGFyc2UoZGVjb2RlZEV2ZW50LCBmYWxzZSk7XG5cbiAgICAgIC8vIEdldCBlbXBsb3llZSBpbmZvIGZyb20gUE9TVCBwYXJhbWV0ZXJzXG4gICAgICBjb25zdCBlbXBsb3llZU5hbWUgPSBmb3JtT2JqZWN0LmVtcGxveWVlX25hbWU7XG4gICAgICBjb25zdCBlbXBsb3llZUlkID0gZm9ybU9iamVjdC5lbXBsb3llZV9pZDtcblxuICAgICAgaWYgKCFlbXBsb3llZU5hbWUgfHwgIWVtcGxveWVlSWQpIHtcbiAgICAgICAgLy8gaWYgbm8gc3BlY2lmaWMgZW1wbG95ZWUgaXMgcHJvdmlkZWQsIHdlIG5lZWQgdG8gZXh0cmFjdCB0aGVtIGZyb20gdGhlIGZpbGVcbiAgICAgICAgLy8gZmlsZUZyb21VaSBpcyB0aGUgZm9ybS1kYXRhIGtleSBhc3NvY2lhdGVkIHRvIHRoZSBmaWxlIGluIHRoZSBtdWx0aXBhcnRcbiAgICAgICAgY29uc3QgdG1wRmlsZSA9IGZvcm1PYmplY3QuZmlsZUZyb21VaTtcbiAgICAgICAgLy8gVXBsb2FkaW5nIHRoZSBmaWxlIGluIFMzXG4gICAgICAgIGNvbnN0IHMzcmVzdWx0ID0gYXdhaXQgdXBsb2FkVG9TMyh0bXBGaWxlKTtcbiAgICAgICAgY29uc3QgeyBmaWxlTmFtZSB9ID0gczNyZXN1bHQ7XG4gICAgICAgIGlmIChzM3Jlc3VsdC5zdGF0dXNDb2RlICE9PSAyMDApIHtcbiAgICAgICAgICByZXR1cm4gczNyZXN1bHQ7IC8vIGZhaWxlZCB0byB1cGxvYWQgdG8gczNcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHdlIGdldCB0aGUgbGlzdCBvZiBhbGwgZW1wbG95ZWVzIGZyb20gdGhlIHVwbG9hZGVkIHBpY3R1cmVcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0RW1wbG95ZWVMaXN0KHRtcEZpbGUpO1xuICAgICAgICBzdGF0dXNDb2RlID0gcmVzdWx0LnN0YXR1c0NvZGU7XG4gICAgICAgIGlmIChyZXN1bHQuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDsgLy8gZmFpbGVkIHRvIGNhbGwgYmVkcm9ja1xuICAgICAgICB9XG4gICAgICAgIGJvZHlSZXN1bHQgPSB7XG4gICAgICAgICAgZW1wbG95ZWVMaXN0OiByZXN1bHQuZW1wbG95ZWVJbmZvLFxuICAgICAgICAgIGZpbGVOYW1lLFxuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgLy8gR2V0IHRpbWVzaGVldHMgZm9yIHRoZSBzcGVjaWZpZWQgZW1wbG95ZWVcbiAgICAgICAgY29uc3QgczNGaWxlbmFtZSA9IGZvcm1PYmplY3QuczNGaWxlbmFtZTtcbiAgICAgICAgY29uc3QgZmlsZUJ1ZmZlciA9IGF3YWl0IGxvYWRGcm9tUzMoczNGaWxlbmFtZSk7XG4gICAgICAgIGNvbnN0IGJlZFJvY2tSZXN1bHQgPSBhd2FpdCBnZXRFbXBsb3llZVRpbWVzaGVldChcbiAgICAgICAgICBzM0ZpbGVuYW1lLFxuICAgICAgICAgIGZpbGVCdWZmZXIsXG4gICAgICAgICAgZW1wbG95ZWVOYW1lLFxuICAgICAgICAgIGVtcGxveWVlSWQsXG4gICAgICAgICk7XG4gICAgICAgIHN0YXR1c0NvZGUgPSBiZWRSb2NrUmVzdWx0LnN0YXR1c0NvZGU7XG5cbiAgICAgICAgaWYgKGJlZFJvY2tSZXN1bHQuc3RhdHVzQ29kZSA9PT0gMjAwKSB7XG4gICAgICAgICAgYm9keVJlc3VsdCA9IHtcbiAgICAgICAgICAgIHRpbWVzaGVldEluZm86IGJlZFJvY2tSZXN1bHQudGltZXNoZWV0SW5mbyxcbiAgICAgICAgICB9O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBiZWRSb2NrUmVzdWx0O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIChlcnJvcikge1xuICAgIGlmIChlcnJvciBpbnN0YW5jZW9mIEVycm9yKSB7XG4gICAgICBib2R5UmVzdWx0ID0gZXJyb3Iuc3RhY2s7XG4gICAgfSBlbHNlIHtcbiAgICAgIGJvZHlSZXN1bHQgPSBlcnJvcjtcbiAgICB9XG4gIH1cblxuICBjb25zdCByZXN1bHQgPSB7XG4gICAgc3RhdHVzQ29kZSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICBcIkFjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpblwiOiBcIipcIixcbiAgICAgIFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgIH0sXG4gICAgYm9keTogSlNPTi5zdHJpbmdpZnkoYm9keVJlc3VsdCksXG4gIH07XG4gIGNvbnNvbGUubG9nKFwiZmluYWwgcmVzdWx0XCIsIHJlc3VsdCk7XG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5leHBvcnQgeyBoYW5kbGVyIH07XG4iXX0=