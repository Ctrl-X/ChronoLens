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
            // fileFromUi is the form-data key associated to the file in the multipart
            const tmpFile = formObject.fileFromUi;
            // Get employee info from POST parameters
            const employeeName = formObject.employee_name;
            const employeeId = formObject.employee_id;
            if (!employeeName || !employeeId) {
                // if no specific employee is provided,we get the list of all employees
                const result = await (0, bedrockUtils_1.getEmployeeList)(tmpFile);
                statusCode = result.statusCode;
                if (result.statusCode !== 200) {
                    return result;
                }
                bodyResult = {
                    employeeList: result.employeeInfo,
                };
                // Optional :  Example of uploading the file in S3
                const s3result = await (0, s3Utils_1.default)(tmpFile);
                if (s3result.statusCode == 200) {
                    const { fileName } = s3result;
                    bodyResult = { ...bodyResult, fileName };
                }
            }
            else {
                // Get timesheets for the specified employee
                const bedRockResult = await (0, bedrockUtils_1.getEmployeeTimesheet)(tmpFile, employeeName, employeeId);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFFekQsNkNBQXlDO0FBQ3pDLHVEQUE2RTtBQUU3RSxNQUFNLE9BQU8sR0FBRyxLQUFLLFdBQVcsS0FBVSxFQUFFLE9BQVk7SUFDdEQsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztJQUV0QixJQUFJLENBQUM7UUFDSCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLElBQUksTUFBTSxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQzNDLHNCQUFzQjtZQUN0QixVQUFVLEdBQUcscUJBQXFCLENBQUM7UUFDckMsQ0FBQzthQUFNLENBQUM7WUFDTix3Q0FBd0M7WUFDeEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUM5QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakQsTUFBTSxZQUFZLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV4RCwwRUFBMEU7WUFDMUUsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUV0Qyx5Q0FBeUM7WUFDekMsTUFBTSxZQUFZLEdBQUcsVUFBVSxDQUFDLGFBQWEsQ0FBQztZQUM5QyxNQUFNLFVBQVUsR0FBRyxVQUFVLENBQUMsV0FBVyxDQUFDO1lBRTFDLElBQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztnQkFDakMsdUVBQXVFO2dCQUN2RSxNQUFNLE1BQU0sR0FBRyxNQUFNLElBQUEsOEJBQWUsRUFBQyxPQUFPLENBQUMsQ0FBQztnQkFDOUMsVUFBVSxHQUFHLE1BQU0sQ0FBQyxVQUFVLENBQUM7Z0JBQy9CLElBQUksTUFBTSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDOUIsT0FBTyxNQUFNLENBQUM7Z0JBQ2hCLENBQUM7Z0JBQ0QsVUFBVSxHQUFHO29CQUNYLFlBQVksRUFBRSxNQUFNLENBQUMsWUFBWTtpQkFDbEMsQ0FBQztnQkFDRixrREFBa0Q7Z0JBQ2xELE1BQU0sUUFBUSxHQUFHLE1BQU0sSUFBQSxpQkFBVSxFQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUMzQyxJQUFJLFFBQVEsQ0FBQyxVQUFVLElBQUksR0FBRyxFQUFFLENBQUM7b0JBQy9CLE1BQU0sRUFBRSxRQUFRLEVBQUUsR0FBRyxRQUFRLENBQUM7b0JBQzlCLFVBQVUsR0FBRyxFQUFFLEdBQUcsVUFBVSxFQUFFLFFBQVEsRUFBRSxDQUFDO2dCQUMzQyxDQUFDO1lBQ0gsQ0FBQztpQkFBTSxDQUFDO2dCQUNOLDRDQUE0QztnQkFDNUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLG1DQUFvQixFQUM5QyxPQUFPLEVBQ1AsWUFBWSxFQUNaLFVBQVUsQ0FDWCxDQUFDO2dCQUVGLElBQUksYUFBYSxDQUFDLFVBQVUsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDckMsVUFBVSxHQUFHO3dCQUNYLGFBQWEsRUFBRSxhQUFhLENBQUMsYUFBYTtxQkFDM0MsQ0FBQztnQkFDSixDQUFDO3FCQUFNLENBQUM7b0JBQ04sT0FBTyxhQUFhLENBQUM7Z0JBQ3ZCLENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFLENBQUM7WUFDM0IsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0IsQ0FBQzthQUFNLENBQUM7WUFDTixVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUc7UUFDYixVQUFVO1FBQ1YsT0FBTyxFQUFFO1lBQ1AsNkJBQTZCLEVBQUUsR0FBRztZQUNsQyxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DO1FBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO0tBQ2pDLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFTywwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG11bHRpcGFydCA9IHJlcXVpcmUoXCJhd3MtbGFtYmRhLW11bHRpcGFydC1wYXJzZXJcIik7XG5cbmltcG9ydCB1cGxvYWRUb1MzIGZyb20gXCIuL3V0aWxzL3MzVXRpbHNcIjtcbmltcG9ydCB7IGdldEVtcGxveWVlVGltZXNoZWV0LCBnZXRFbXBsb3llZUxpc3QgfSBmcm9tIFwiLi91dGlscy9iZWRyb2NrVXRpbHNcIjtcblxuY29uc3QgaGFuZGxlciA9IGFzeW5jIGZ1bmN0aW9uIChldmVudDogYW55LCBjb250ZXh0OiBhbnkpIHtcbiAgbGV0IHN0YXR1c0NvZGUgPSA0MDA7XG4gIGxldCBib2R5UmVzdWx0ID0gbnVsbDtcblxuICB0cnkge1xuICAgIGxldCBtZXRob2QgPSBldmVudC5odHRwTWV0aG9kO1xuICAgIGNvbnNvbGUubG9nKFwibWV0aG9kXCIsIG1ldGhvZCk7XG4gICAgaWYgKG1ldGhvZCAhPSBcIlBPU1RcIiB8fCBldmVudC5wYXRoICE9PSBcIi9cIikge1xuICAgICAgLy8gV2Ugb25seSBhY2NlcHQgUE9TVFxuICAgICAgYm9keVJlc3VsdCA9IFwiV2Ugb25seSBhY2NlcHQgUE9TVFwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwYXJzZSB0aGUgYmFzZTY0IGZyb20gdGhlIEFQSSBHYXRld2F5XG4gICAgICBjb25zdCBiYXNlNjRCb2R5ID0gZXZlbnQuYm9keTtcbiAgICAgIGNvbnN0IGJ1ZmYgPSBCdWZmZXIuZnJvbShiYXNlNjRCb2R5LCBcImJhc2U2NFwiKTtcbiAgICAgIGNvbnN0IGRlY29kZWRFdmVudEJvZHkgPSBidWZmLnRvU3RyaW5nKFwibGF0aW4xXCIpO1xuICAgICAgY29uc3QgZGVjb2RlZEV2ZW50ID0geyAuLi5ldmVudCwgYm9keTogZGVjb2RlZEV2ZW50Qm9keSB9O1xuICAgICAgY29uc3QgZm9ybU9iamVjdCA9IG11bHRpcGFydC5wYXJzZShkZWNvZGVkRXZlbnQsIGZhbHNlKTtcblxuICAgICAgLy8gZmlsZUZyb21VaSBpcyB0aGUgZm9ybS1kYXRhIGtleSBhc3NvY2lhdGVkIHRvIHRoZSBmaWxlIGluIHRoZSBtdWx0aXBhcnRcbiAgICAgIGNvbnN0IHRtcEZpbGUgPSBmb3JtT2JqZWN0LmZpbGVGcm9tVWk7XG5cbiAgICAgIC8vIEdldCBlbXBsb3llZSBpbmZvIGZyb20gUE9TVCBwYXJhbWV0ZXJzXG4gICAgICBjb25zdCBlbXBsb3llZU5hbWUgPSBmb3JtT2JqZWN0LmVtcGxveWVlX25hbWU7XG4gICAgICBjb25zdCBlbXBsb3llZUlkID0gZm9ybU9iamVjdC5lbXBsb3llZV9pZDtcblxuICAgICAgaWYgKCFlbXBsb3llZU5hbWUgfHwgIWVtcGxveWVlSWQpIHtcbiAgICAgICAgLy8gaWYgbm8gc3BlY2lmaWMgZW1wbG95ZWUgaXMgcHJvdmlkZWQsd2UgZ2V0IHRoZSBsaXN0IG9mIGFsbCBlbXBsb3llZXNcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gYXdhaXQgZ2V0RW1wbG95ZWVMaXN0KHRtcEZpbGUpO1xuICAgICAgICBzdGF0dXNDb2RlID0gcmVzdWx0LnN0YXR1c0NvZGU7XG4gICAgICAgIGlmIChyZXN1bHQuc3RhdHVzQ29kZSAhPT0gMjAwKSB7XG4gICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgICAgICBib2R5UmVzdWx0ID0ge1xuICAgICAgICAgIGVtcGxveWVlTGlzdDogcmVzdWx0LmVtcGxveWVlSW5mbyxcbiAgICAgICAgfTtcbiAgICAgICAgLy8gT3B0aW9uYWwgOiAgRXhhbXBsZSBvZiB1cGxvYWRpbmcgdGhlIGZpbGUgaW4gUzNcbiAgICAgICAgY29uc3QgczNyZXN1bHQgPSBhd2FpdCB1cGxvYWRUb1MzKHRtcEZpbGUpO1xuICAgICAgICBpZiAoczNyZXN1bHQuc3RhdHVzQ29kZSA9PSAyMDApIHtcbiAgICAgICAgICBjb25zdCB7IGZpbGVOYW1lIH0gPSBzM3Jlc3VsdDtcbiAgICAgICAgICBib2R5UmVzdWx0ID0geyAuLi5ib2R5UmVzdWx0LCBmaWxlTmFtZSB9O1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBHZXQgdGltZXNoZWV0cyBmb3IgdGhlIHNwZWNpZmllZCBlbXBsb3llZVxuICAgICAgICBjb25zdCBiZWRSb2NrUmVzdWx0ID0gYXdhaXQgZ2V0RW1wbG95ZWVUaW1lc2hlZXQoXG4gICAgICAgICAgdG1wRmlsZSxcbiAgICAgICAgICBlbXBsb3llZU5hbWUsXG4gICAgICAgICAgZW1wbG95ZWVJZCxcbiAgICAgICAgKTtcblxuICAgICAgICBpZiAoYmVkUm9ja1Jlc3VsdC5zdGF0dXNDb2RlID09PSAyMDApIHtcbiAgICAgICAgICBib2R5UmVzdWx0ID0ge1xuICAgICAgICAgICAgdGltZXNoZWV0SW5mbzogYmVkUm9ja1Jlc3VsdC50aW1lc2hlZXRJbmZvLFxuICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGJlZFJvY2tSZXN1bHQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGJvZHlSZXN1bHQgPSBlcnJvci5zdGFjaztcbiAgICB9IGVsc2Uge1xuICAgICAgYm9keVJlc3VsdCA9IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICBzdGF0dXNDb2RlLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiKlwiLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5UmVzdWx0KSxcbiAgfTtcbiAgY29uc29sZS5sb2coXCJmaW5hbCByZXN1bHRcIiwgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCB7IGhhbmRsZXIgfTtcbiJdfQ==