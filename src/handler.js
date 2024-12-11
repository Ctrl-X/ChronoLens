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
            bodyResult = "We only accept POST /";
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
            // Example of getting description from Bedrock
            const bedRockResult = await (0, bedrockUtils_1.default)(tmpFile);
            if (bedRockResult.statusCode != 200) {
                return bedRockResult; // return the error as is
            }
            else {
                statusCode = 200;
                const { timesheetInfo } = bedRockResult;
                bodyResult = {
                    timesheetInfo,
                };
            }
            // Optional :  Example of uploading the file in S3
            const s3result = await (0, s3Utils_1.default)(tmpFile);
            if (s3result.statusCode == 200) {
                const { fileName } = s3result;
                bodyResult = { ...bodyResult, fileName };
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaGFuZGxlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImhhbmRsZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEsTUFBTSxTQUFTLEdBQUcsT0FBTyxDQUFDLDZCQUE2QixDQUFDLENBQUM7QUFFekQsNkNBQXlDO0FBQ3pDLHVEQUFtRDtBQUVuRCxNQUFNLE9BQU8sR0FBRyxLQUFLLFdBQVcsS0FBVSxFQUFFLE9BQVk7SUFDdEQsSUFBSSxVQUFVLEdBQUcsR0FBRyxDQUFDO0lBQ3JCLElBQUksVUFBVSxHQUFHLElBQUksQ0FBQztJQUV0QixJQUFJLENBQUM7UUFDSCxJQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQzlCLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO1FBQzlCLElBQUksTUFBTSxJQUFJLE1BQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQzNDLHNCQUFzQjtZQUN0QixVQUFVLEdBQUcsdUJBQXVCLENBQUM7UUFDdkMsQ0FBQzthQUFNLENBQUM7WUFDTix3Q0FBd0M7WUFDeEMsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztZQUM5QixNQUFNLElBQUksR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxRQUFRLENBQUMsQ0FBQztZQUMvQyxNQUFNLGdCQUFnQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDakQsTUFBTSxZQUFZLEdBQUcsRUFBRSxHQUFHLEtBQUssRUFBRSxJQUFJLEVBQUUsZ0JBQWdCLEVBQUUsQ0FBQztZQUMxRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLFlBQVksRUFBRSxLQUFLLENBQUMsQ0FBQztZQUV4RCwwRUFBMEU7WUFDMUUsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFVBQVUsQ0FBQztZQUV0Qyw4Q0FBOEM7WUFDOUMsTUFBTSxhQUFhLEdBQUcsTUFBTSxJQUFBLHNCQUFlLEVBQUMsT0FBTyxDQUFDLENBQUM7WUFDckQsSUFBSSxhQUFhLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUNwQyxPQUFPLGFBQWEsQ0FBQyxDQUFDLHlCQUF5QjtZQUNqRCxDQUFDO2lCQUFNLENBQUM7Z0JBQ04sVUFBVSxHQUFHLEdBQUcsQ0FBQztnQkFDakIsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLGFBQWEsQ0FBQztnQkFDeEMsVUFBVSxHQUFHO29CQUNYLGFBQWE7aUJBQ2QsQ0FBQztZQUNKLENBQUM7WUFFRCxrREFBa0Q7WUFDbEQsTUFBTSxRQUFRLEdBQUcsTUFBTSxJQUFBLGlCQUFVLEVBQUMsT0FBTyxDQUFDLENBQUM7WUFFM0MsSUFBSSxRQUFRLENBQUMsVUFBVSxJQUFJLEdBQUcsRUFBRSxDQUFDO2dCQUMvQixNQUFNLEVBQUUsUUFBUSxFQUFFLEdBQUcsUUFBUSxDQUFDO2dCQUM5QixVQUFVLEdBQUcsRUFBRSxHQUFHLFVBQVUsRUFBRSxRQUFRLEVBQUUsQ0FBQztZQUMzQyxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsSUFBSSxLQUFLLFlBQVksS0FBSyxFQUFFLENBQUM7WUFDM0IsVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0IsQ0FBQzthQUFNLENBQUM7WUFDTixVQUFVLEdBQUcsS0FBSyxDQUFDO1FBQ3JCLENBQUM7SUFDSCxDQUFDO0lBRUQsTUFBTSxNQUFNLEdBQUc7UUFDYixVQUFVO1FBQ1YsT0FBTyxFQUFFO1lBQ1AsNkJBQTZCLEVBQUUsR0FBRztZQUNsQyxjQUFjLEVBQUUsa0JBQWtCO1NBQ25DO1FBQ0QsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsVUFBVSxDQUFDO0tBQ2pDLENBQUM7SUFDRixPQUFPLENBQUMsR0FBRyxDQUFDLGNBQWMsRUFBRSxNQUFNLENBQUMsQ0FBQztJQUNwQyxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDLENBQUM7QUFFTywwQkFBTyIsInNvdXJjZXNDb250ZW50IjpbImNvbnN0IG11bHRpcGFydCA9IHJlcXVpcmUoXCJhd3MtbGFtYmRhLW11bHRpcGFydC1wYXJzZXJcIik7XG5cbmltcG9ydCB1cGxvYWRUb1MzIGZyb20gXCIuL3V0aWxzL3MzVXRpbHNcIjtcbmltcG9ydCBkZXNjcmliZVBpY3R1cmUgZnJvbSBcIi4vdXRpbHMvYmVkcm9ja1V0aWxzXCI7XG5cbmNvbnN0IGhhbmRsZXIgPSBhc3luYyBmdW5jdGlvbiAoZXZlbnQ6IGFueSwgY29udGV4dDogYW55KSB7XG4gIGxldCBzdGF0dXNDb2RlID0gNDAwO1xuICBsZXQgYm9keVJlc3VsdCA9IG51bGw7XG5cbiAgdHJ5IHtcbiAgICBsZXQgbWV0aG9kID0gZXZlbnQuaHR0cE1ldGhvZDtcbiAgICBjb25zb2xlLmxvZyhcIm1ldGhvZFwiLCBtZXRob2QpO1xuICAgIGlmIChtZXRob2QgIT0gXCJQT1NUXCIgfHwgZXZlbnQucGF0aCAhPT0gXCIvXCIpIHtcbiAgICAgIC8vIFdlIG9ubHkgYWNjZXB0IFBPU1RcbiAgICAgIGJvZHlSZXN1bHQgPSBcIldlIG9ubHkgYWNjZXB0IFBPU1QgL1wiO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBwYXJzZSB0aGUgYmFzZTY0IGZyb20gdGhlIEFQSSBHYXRld2F5XG4gICAgICBjb25zdCBiYXNlNjRCb2R5ID0gZXZlbnQuYm9keTtcbiAgICAgIGNvbnN0IGJ1ZmYgPSBCdWZmZXIuZnJvbShiYXNlNjRCb2R5LCBcImJhc2U2NFwiKTtcbiAgICAgIGNvbnN0IGRlY29kZWRFdmVudEJvZHkgPSBidWZmLnRvU3RyaW5nKFwibGF0aW4xXCIpO1xuICAgICAgY29uc3QgZGVjb2RlZEV2ZW50ID0geyAuLi5ldmVudCwgYm9keTogZGVjb2RlZEV2ZW50Qm9keSB9O1xuICAgICAgY29uc3QgZm9ybU9iamVjdCA9IG11bHRpcGFydC5wYXJzZShkZWNvZGVkRXZlbnQsIGZhbHNlKTtcblxuICAgICAgLy8gZmlsZUZyb21VaSBpcyB0aGUgZm9ybS1kYXRhIGtleSBhc3NvY2lhdGVkIHRvIHRoZSBmaWxlIGluIHRoZSBtdWx0aXBhcnRcbiAgICAgIGNvbnN0IHRtcEZpbGUgPSBmb3JtT2JqZWN0LmZpbGVGcm9tVWk7XG5cbiAgICAgIC8vIEV4YW1wbGUgb2YgZ2V0dGluZyBkZXNjcmlwdGlvbiBmcm9tIEJlZHJvY2tcbiAgICAgIGNvbnN0IGJlZFJvY2tSZXN1bHQgPSBhd2FpdCBkZXNjcmliZVBpY3R1cmUodG1wRmlsZSk7XG4gICAgICBpZiAoYmVkUm9ja1Jlc3VsdC5zdGF0dXNDb2RlICE9IDIwMCkge1xuICAgICAgICByZXR1cm4gYmVkUm9ja1Jlc3VsdDsgLy8gcmV0dXJuIHRoZSBlcnJvciBhcyBpc1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc3RhdHVzQ29kZSA9IDIwMDtcbiAgICAgICAgY29uc3QgeyB0aW1lc2hlZXRJbmZvIH0gPSBiZWRSb2NrUmVzdWx0O1xuICAgICAgICBib2R5UmVzdWx0ID0ge1xuICAgICAgICAgIHRpbWVzaGVldEluZm8sXG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIC8vIE9wdGlvbmFsIDogIEV4YW1wbGUgb2YgdXBsb2FkaW5nIHRoZSBmaWxlIGluIFMzXG4gICAgICBjb25zdCBzM3Jlc3VsdCA9IGF3YWl0IHVwbG9hZFRvUzModG1wRmlsZSk7XG5cbiAgICAgIGlmIChzM3Jlc3VsdC5zdGF0dXNDb2RlID09IDIwMCkge1xuICAgICAgICBjb25zdCB7IGZpbGVOYW1lIH0gPSBzM3Jlc3VsdDtcbiAgICAgICAgYm9keVJlc3VsdCA9IHsgLi4uYm9keVJlc3VsdCwgZmlsZU5hbWUgfTtcbiAgICAgIH1cbiAgICB9XG4gIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIGJvZHlSZXN1bHQgPSBlcnJvci5zdGFjaztcbiAgICB9IGVsc2Uge1xuICAgICAgYm9keVJlc3VsdCA9IGVycm9yO1xuICAgIH1cbiAgfVxuXG4gIGNvbnN0IHJlc3VsdCA9IHtcbiAgICBzdGF0dXNDb2RlLFxuICAgIGhlYWRlcnM6IHtcbiAgICAgIFwiQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luXCI6IFwiKlwiLFxuICAgICAgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgfSxcbiAgICBib2R5OiBKU09OLnN0cmluZ2lmeShib2R5UmVzdWx0KSxcbiAgfTtcbiAgY29uc29sZS5sb2coXCJmaW5hbCByZXN1bHRcIiwgcmVzdWx0KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cbmV4cG9ydCB7IGhhbmRsZXIgfTtcbiJdfQ==