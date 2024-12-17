"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeList = exports.getEmployeeTimesheet = void 0;
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
// Initialize the Bedrock client with your region
const bedrockClient = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: "us-west-2" });
const { ApplyGuardrailCommand } = require("@aws-sdk/client-bedrock");
async function getEmployeeList(file) {
    var _a, _b, _c, _d, _e;
    // Convert file Buffer to a Base64 string
    const buffer = Buffer.from(file.content, "binary");
    // Get file extension from mimetype or filename
    const fileFormat = ((_b = (_a = file.filename.split('.')) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
    const isImage = ['png', 'jpeg', 'jpg', 'gif', 'webp'].includes(fileFormat);
    const modelId = isImage ? process.env.MODEL_ID : 'us.amazon.nova-pro-v1:0';
    // Determine model based on file type
    console.log("file.filename", file.filename);
    console.log("fileFormat", fileFormat);
    console.log("selected model", modelId);
    // modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    // modelId: "anthropic.claude-3-5-sonnet-20240620-v1:00",
    // modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    // prepare Claude 3 prompt
    /*   const params = {
           modelId: process.env.MODEL_ID,
           contentType: "application/json",
           accept: "application/json",
           body: JSON.stringify({
               anthropic_version: "bedrock-2023-05-31",
               max_tokens: 2048,
               temperature: 0,
               messages: [
                   {
                       role: "user",
                       content: [
                           {
                               "type": "image",
                               "source": {
                                   "type": "base64",
                                   "media_type": "image/jpeg",
                                   "data": base64file
                               }
                           },
                           {
                               "type": "text",
                               "text": "I am providing you with an file of a timesheet for one or multiple employees. Based on the visual information available, please analyze the image and generate a JSON array of \"employees\" object containing the following attributes when available: \"employee_name\", \"employee_id\". In addition ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed.If you don't find the information for \"employee_id\", you have to omit the field. Skip preambule and only give a valid full JSON in your response containing all employees without anything else (note, comment, phrase) except the JSON. Here is the image:"
                           }
                       ]
                   }
               ]
           })
       }
   */
    const member = isImage ? {
        image: {
            format: fileFormat,
            source: {
                bytes: buffer
            }
        }
    } : {
        document: {
            format: fileFormat,
            name: fileFormat + "_file",
            source: {
                bytes: buffer
            }
        }
    };
    const input = {
        modelId: modelId,
        messages: [
            {
                role: "user",
                content: [
                    { ...member },
                    {
                        text: "I am providing you with an file of a timesheet for one or multiple employees. Based on the visual information available, please analyze the image and generate a JSON array of \"employees\" object containing the following attributes when available: \"name\", \"id\". In addition ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed.If you don't find the information for \"employee_id\", you have to omit the field. Skip preambule and only give a valid full JSON in your response containing all employees. DO add anthing like : notes, comments, phrase, markdown like ```json ... ```."
                    }
                ]
            }
        ]
    };
    try {
        console.log("calling ConverseCommand : ", input);
        // Create a command object with the request information
        //const command = new InvokeModelCommand(params)
        const command = new client_bedrock_runtime_1.ConverseCommand(input);
        // Use the client to send the command to Amazon Bedrock
        const response = await bedrockClient.send(command);
        // Parse the answer
        const outputMessage = (_c = response.output) === null || _c === void 0 ? void 0 : _c.message;
        //const response_body = JSON.parse(outputMessage)
        console.log("response.body : ", outputMessage);
        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body
        // Return the product information
        //const employeeInfo = JSON.parse(response_body.content[0].text)
        let employeeInfo = ((_e = (_d = outputMessage === null || outputMessage === void 0 ? void 0 : outputMessage.content) === null || _d === void 0 ? void 0 : _d.at(0)) === null || _e === void 0 ? void 0 : _e.text) || "";
        // Make sure we strip any phantom tag
        employeeInfo = employeeInfo.replace("```json", "");
        employeeInfo = employeeInfo.replace("```", "");
        console.log("employeeInfo : ", employeeInfo);
        return {
            statusCode: 200,
            employeeInfo
        };
    }
    catch (err) {
        console.error("Error invoking Bedrock:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Failed to upload the file",
                error: err.message
            })
        };
    }
}
exports.getEmployeeList = getEmployeeList;
async function getEmployeeTimesheet(filename, buffer, employee_name, employee_id) {
    var _a, _b, _c, _d, _e;
    try {
        // modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        // modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        // modelId: "anthropic.claude-3-5-sonnet-20240620-v1:00",
        // modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
        // prepare Claude 3 prompt
        let fullname = "";
        if (employee_name) {
            fullname = `"${employee_name}"`;
        }
        if (employee_id) {
            fullname = `${fullname} (employee id is "${employee_id}")`;
        }
        // Get file extension from mimetype or filename
        const fileFormat = ((_b = (_a = filename.split('.')) === null || _a === void 0 ? void 0 : _a.pop()) === null || _b === void 0 ? void 0 : _b.toLowerCase()) || "";
        const isImage = ['png', 'jpeg', 'jpg', 'gif', 'webp'].includes(fileFormat);
        const modelId = isImage ? process.env.MODEL_ID : 'us.amazon.nova-pro-v1:0';
        // Determine model based on file type
        console.log("file.filename", filename);
        console.log("fileFormat", fileFormat);
        console.log("selected model", modelId);
        const member = isImage ? {
            image: {
                format: fileFormat,
                source: {
                    bytes: buffer
                }
            }
        } : {
            document: {
                format: fileFormat,
                name: fileFormat + "_file",
                source: {
                    bytes: buffer
                }
            }
        };
        const input = {
            modelId: modelId,
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            ...member
                        },
                        {
                            text: `I am providing you with an file of a timesheet for one or more employees. Based on the visual information available, please analyze the image and generate a JSON array for just the employee named ${fullname} containing objects with following attributes when available: {start_period:date,end_period:date,days:array}.For the 'start_period' and 'end_period' field, you need to look carefully at the whole file to find the "semaine" or "week" or "period" of the year (it can be multiple days or just one) that has been worked and provide the date range. For the employee ${fullname} timesheet data, you may find one or multiple days and time within that start and end period. Make sure that you provide every time period you find for the specified employee, even if there is multiple sub-total. You need to provide each day (could be one or multiple) in the "days" array containing : {work_date: date, start: ?time, end: ?time, lunch_time : ?number, overtime: ?number, worked_hours: ?number} for each work time of the employee. if you don't find the information for one of fields "start" , "end", "lunch_time", "overtime",  or "worked_hours", you must not include the field in the JSON. Make sure the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed. Skip preambule and only give a valid full JSON in your response containing the specified employee information without anything else (note, comment, phrase) except the JSON.`
                        }
                    ]
                }
            ]
        };
        // Create a command object with the request information
        const command = new client_bedrock_runtime_1.ConverseCommand(input);
        // Use the client to send the command to Amazon Bedrock
        const response = await bedrockClient.send(command);
        // Parse the answer
        //const textDecoder = new TextDecoder("utf-8")
        //console.log("response.body : ",textDecoder.decode(response.body))
        //const response_body = JSON.parse(textDecoder.decode(response.body))
        const outputMessage = (_c = response.output) === null || _c === void 0 ? void 0 : _c.message;
        let timesheetInfo = ((_e = (_d = outputMessage === null || outputMessage === void 0 ? void 0 : outputMessage.content) === null || _d === void 0 ? void 0 : _d.at(0)) === null || _e === void 0 ? void 0 : _e.text) || "";
        timesheetInfo = timesheetInfo.replace("```json", "");
        timesheetInfo = timesheetInfo.replace("```", "");
        console.log("response.body : ", timesheetInfo);
        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body
        return {
            statusCode: 200,
            timesheetInfo
        };
    }
    catch (err) {
        console.error("Error invoking Bedrock:", err);
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Failed to upload the file",
                error: err.message
            })
        };
    }
}
exports.getEmployeeTimesheet = getEmployeeTimesheet;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVkcm9ja1V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmVkcm9ja1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRFQU15QztBQUV6QyxpREFBaUQ7QUFDakQsTUFBTSxhQUFhLEdBQUcsSUFBSSw2Q0FBb0IsQ0FBQyxFQUFDLE1BQU0sRUFBRSxXQUFXLEVBQUMsQ0FBQyxDQUFBO0FBQ3JFLE1BQU0sRUFBQyxxQkFBcUIsRUFBQyxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBR2xFLEtBQUssVUFBVSxlQUFlLENBQUMsSUFBUzs7SUFDcEMseUNBQXlDO0lBQ3pDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUVsRCwrQ0FBK0M7SUFDL0MsTUFBTSxVQUFVLEdBQVEsQ0FBQSxNQUFBLE1BQUEsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLDBDQUFFLEdBQUcsRUFBRSwwQ0FBRSxXQUFXLEVBQUUsS0FBSSxFQUFFLENBQUM7SUFFN0UsTUFBTSxPQUFPLEdBQUcsQ0FBQyxLQUFLLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNFLE1BQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLHlCQUF5QixDQUFBO0lBRTFFLHFDQUFxQztJQUNyQyxPQUFPLENBQUMsR0FBRyxDQUFDLGVBQWUsRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUE7SUFDM0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxZQUFZLEVBQUUsVUFBVSxDQUFDLENBQUE7SUFDckMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxnQkFBZ0IsRUFBRSxPQUFPLENBQUMsQ0FB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Q2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDN0MsT0FBTztZQUNILFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFLEVBQUMsY0FBYyxFQUFFLGtCQUFrQixFQUFDO1lBQzdDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQixPQUFPLEVBQUUsMkJBQTJCO2dCQUNwQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU87YUFDckIsQ0FBQztTQUNMLENBQUE7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVPLG9EQUFvQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgQmVkcm9ja1J1bnRpbWVDbGllbnQsXG4gICAgQ29udmVyc2VDb21tYW5kLFxuICAgIENvbnZlcnNlUmVxdWVzdCxcbiAgICBEb2N1bWVudEJsb2NrLFxuICAgIEltYWdlQmxvY2tcbn0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1iZWRyb2NrLXJ1bnRpbWVcIjtcblxuLy8gSW5pdGlhbGl6ZSB0aGUgQmVkcm9jayBjbGllbnQgd2l0aCB5b3VyIHJlZ2lvblxuY29uc3QgYmVkcm9ja0NsaWVudCA9IG5ldyBCZWRyb2NrUnVudGltZUNsaWVudCh7cmVnaW9uOiBcInVzLXdlc3QtMlwifSlcbmNvbnN0IHtBcHBseUd1YXJkcmFpbENvbW1hbmR9ID0gcmVxdWlyZShcIkBhd3Mtc2RrL2NsaWVudC1iZWRyb2NrXCIpXG5cblxuYXN5bmMgZnVuY3Rpb24gZ2V0RW1wbG95ZWVMaXN0KGZpbGU6IGFueSkge1xuICAgIC8vIENvbnZlcnQgZmlsZSBCdWZmZXIgdG8gYSBCYXNlNjQgc3RyaW5nXG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oZmlsZS5jb250ZW50LCBcImJpbmFyeVwiKVxuXG4gICAgLy8gR2V0IGZpbGUgZXh0ZW5zaW9uIGZyb20gbWltZXR5cGUgb3IgZmlsZW5hbWVcbiAgICBjb25zdCBmaWxlRm9ybWF0OiBhbnkgPSBmaWxlLmZpbGVuYW1lLnNwbGl0KCcuJyk/LnBvcCgpPy50b0xvd2VyQ2FzZSgpIHx8IFwiXCI7XG5cbiAgICBjb25zdCBpc0ltYWdlID0gWydwbmcnLCAnanBlZycsICdqcGcnLCAnZ2lmJywgJ3dlYnAnXS5pbmNsdWRlcyhmaWxlRm9ybWF0KTtcbiAgICBjb25zdCBtb2RlbElkID0gaXNJbWFnZSA/IHByb2Nlc3MuZW52Lk1PREVMX0lEIDogJ3VzLmFtYXpvbi5ub3ZhLXByby12MTowJ1xuXG4gICAgLy8gRGV0ZXJtaW5lIG1vZGVsIGJhc2VkIG9uIGZpbGUgdHlwZVxuICAgIGNvbnNvbGUubG9nKFwiZmlsZS5maWxlbmFtZVwiLCBmaWxlLmZpbGVuYW1lKVxuICAgIGNvbnNvbGUubG9nKFwiZmlsZUZvcm1hdFwiLCBmaWxlRm9ybWF0KVxuICAgIGNvbnNvbGUubG9nKFwic2VsZWN0ZWQgbW9kZWxcIiwgbW9kZWxJZClcblxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLWhhaWt1LTIwMjQwMzA3LXYxOjBcIixcbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1zb25uZXQtMjAyNDAyMjktdjE6MFwiLFxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLTUtc29ubmV0LTIwMjQwNjIwLXYxOjAwXCIsXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDEwMjItdjI6MFwiLFxuICAgIC8vIHByZXBhcmUgQ2xhdWRlIDMgcHJvbXB0XG4gICAgLyogICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgICAgIG1vZGVsSWQ6IHByb2Nlc3MuZW52Lk1PREVMX0lELFxuICAgICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgIGFudGhyb3BpY192ZXJzaW9uOiBcImJlZHJvY2stMjAyMy0wNS0zMVwiLFxuICAgICAgICAgICAgICAgbWF4X3Rva2VuczogMjA0OCxcbiAgICAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJhc2U2NFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lZGlhX3R5cGVcIjogXCJpbWFnZS9qcGVnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBiYXNlNjRmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSSBhbSBwcm92aWRpbmcgeW91IHdpdGggYW4gZmlsZSBvZiBhIHRpbWVzaGVldCBmb3Igb25lIG9yIG11bHRpcGxlIGVtcGxveWVlcy4gQmFzZWQgb24gdGhlIHZpc3VhbCBpbmZvcm1hdGlvbiBhdmFpbGFibGUsIHBsZWFzZSBhbmFseXplIHRoZSBpbWFnZSBhbmQgZ2VuZXJhdGUgYSBKU09OIGFycmF5IG9mIFxcXCJlbXBsb3llZXNcXFwiIG9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlcyB3aGVuIGF2YWlsYWJsZTogXFxcImVtcGxveWVlX25hbWVcXFwiLCBcXFwiZW1wbG95ZWVfaWRcXFwiLiBJbiBhZGRpdGlvbiBlbnN1cmUgdGhhdCB0aGUgSlNPTiBvYmplY3QgaXMgcHJvcGVybHkgZm9ybWF0dGVkIHdpdGggY29ycmVjdCBhdHRyaWJ1dGUgbmFtZXMgYW5kIHZhbHVlcyBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGVzIHdoZW4gbmVlZGVkLklmIHlvdSBkb24ndCBmaW5kIHRoZSBpbmZvcm1hdGlvbiBmb3IgXFxcImVtcGxveWVlX2lkXFxcIiwgeW91IGhhdmUgdG8gb21pdCB0aGUgZmllbGQuIFNraXAgcHJlYW1idWxlIGFuZCBvbmx5IGdpdmUgYSB2YWxpZCBmdWxsIEpTT04gaW4geW91ciByZXNwb25zZSBjb250YWluaW5nIGFsbCBlbXBsb3llZXMgd2l0aG91dCBhbnl0aGluZyBlbHNlIChub3RlLCBjb21tZW50LCBwaHJhc2UpIGV4Y2VwdCB0aGUgSlNPTi4gSGVyZSBpcyB0aGUgaW1hZ2U6XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgfSlcbiAgICAgICB9XG4gICAqL1xuXG4gICAgY29uc3QgbWVtYmVyID0gaXNJbWFnZSA/IHtcbiAgICAgICAgaW1hZ2U6IHtcbiAgICAgICAgICAgIGZvcm1hdDogZmlsZUZvcm1hdCxcbiAgICAgICAgICAgIHNvdXJjZToge1xuICAgICAgICAgICAgICAgIGJ5dGVzOiBidWZmZXJcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0gOiB7XG4gICAgICAgIGRvY3VtZW50OiB7XG4gICAgICAgICAgICBmb3JtYXQ6IGZpbGVGb3JtYXQsXG4gICAgICAgICAgICBuYW1lOiBmaWxlRm9ybWF0ICsgXCJfZmlsZVwiLFxuICAgICAgICAgICAgc291cmNlOlxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXM6IGJ1ZmZlclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb25zdCBpbnB1dDogQ29udmVyc2VSZXF1ZXN0ID0geyAvLyBDb252ZXJzZVJlcXVlc3RcbiAgICAgICAgbW9kZWxJZDogbW9kZWxJZCxcbiAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgIHsuLi5tZW1iZXJ9LFxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiBcIkkgYW0gcHJvdmlkaW5nIHlvdSB3aXRoIGFuIGZpbGUgb2YgYSB0aW1lc2hlZXQgZm9yIG9uZSBvciBtdWx0aXBsZSBlbXBsb3llZXMuIEJhc2VkIG9uIHRoZSB2aXN1YWwgaW5mb3JtYXRpb24gYXZhaWxhYmxlLCBwbGVhc2UgYW5hbHl6ZSB0aGUgaW1hZ2UgYW5kIGdlbmVyYXRlIGEgSlNPTiBhcnJheSBvZiBcXFwiZW1wbG95ZWVzXFxcIiBvYmplY3QgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXMgd2hlbiBhdmFpbGFibGU6IFxcXCJuYW1lXFxcIiwgXFxcImlkXFxcIi4gSW4gYWRkaXRpb24gZW5zdXJlIHRoYXQgdGhlIEpTT04gb2JqZWN0IGlzIHByb3Blcmx5IGZvcm1hdHRlZCB3aXRoIGNvcnJlY3QgYXR0cmlidXRlIG5hbWVzIGFuZCB2YWx1ZXMgZW5jbG9zZWQgaW4gZG91YmxlIHF1b3RlcyB3aGVuIG5lZWRlZC5JZiB5b3UgZG9uJ3QgZmluZCB0aGUgaW5mb3JtYXRpb24gZm9yIFxcXCJlbXBsb3llZV9pZFxcXCIsIHlvdSBoYXZlIHRvIG9taXQgdGhlIGZpZWxkLiBTa2lwIHByZWFtYnVsZSBhbmQgb25seSBnaXZlIGEgdmFsaWQgZnVsbCBKU09OIGluIHlvdXIgcmVzcG9uc2UgY29udGFpbmluZyBhbGwgZW1wbG95ZWVzLiBETyBhZGQgYW50aGluZyBsaWtlIDogbm90ZXMsIGNvbW1lbnRzLCBwaHJhc2UsIG1hcmtkb3duIGxpa2UgYGBganNvbiAuLi4gYGBgLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIENvbnZlcnNlQ29tbWFuZCA6IFwiLCBpbnB1dClcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29tbWFuZCBvYmplY3Qgd2l0aCB0aGUgcmVxdWVzdCBpbmZvcm1hdGlvblxuICAgICAgICAvL2NvbnN0IGNvbW1hbmQgPSBuZXcgSW52b2tlTW9kZWxDb21tYW5kKHBhcmFtcylcbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBDb252ZXJzZUNvbW1hbmQoaW5wdXQpO1xuXG4gICAgICAgIC8vIFVzZSB0aGUgY2xpZW50IHRvIHNlbmQgdGhlIGNvbW1hbmQgdG8gQW1hem9uIEJlZHJvY2tcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBiZWRyb2NrQ2xpZW50LnNlbmQoY29tbWFuZClcblxuICAgICAgICAvLyBQYXJzZSB0aGUgYW5zd2VyXG4gICAgICAgIGNvbnN0IG91dHB1dE1lc3NhZ2UgPSByZXNwb25zZS5vdXRwdXQ/Lm1lc3NhZ2VcbiAgICAgICAgLy9jb25zdCByZXNwb25zZV9ib2R5ID0gSlNPTi5wYXJzZShvdXRwdXRNZXNzYWdlKVxuICAgICAgICBjb25zb2xlLmxvZyhcInJlc3BvbnNlLmJvZHkgOiBcIiwgb3V0cHV0TWVzc2FnZSlcblxuICAgICAgICAvLyBUT0RPIDogSU5WT0tFIEFtYXpvbiBCZWRyb2NrIEd1YXJkcmFpbHMgdG8gdmVyaWZ5IHRoZSBvdXRwdXQgcmVzcG9uc2VfYm9keVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJvZHVjdCBpbmZvcm1hdGlvblxuICAgICAgICAvL2NvbnN0IGVtcGxveWVlSW5mbyA9IEpTT04ucGFyc2UocmVzcG9uc2VfYm9keS5jb250ZW50WzBdLnRleHQpXG4gICAgICAgIGxldCBlbXBsb3llZUluZm8gPSBvdXRwdXRNZXNzYWdlPy5jb250ZW50Py5hdCgwKT8udGV4dCB8fCBcIlwiO1xuICAgICAgICAvLyBNYWtlIHN1cmUgd2Ugc3RyaXAgYW55IHBoYW50b20gdGFnXG4gICAgICAgIGVtcGxveWVlSW5mbyA9IGVtcGxveWVlSW5mby5yZXBsYWNlKFwiYGBganNvblwiLCBcIlwiKVxuICAgICAgICBlbXBsb3llZUluZm8gPSBlbXBsb3llZUluZm8ucmVwbGFjZShcImBgYFwiLCBcIlwiKVxuICAgICAgICBjb25zb2xlLmxvZyhcImVtcGxveWVlSW5mbyA6IFwiLCBlbXBsb3llZUluZm8pXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgICAgICBlbXBsb3llZUluZm9cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbnZva2luZyBCZWRyb2NrOlwiLCBlcnIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIHVwbG9hZCB0aGUgZmlsZVwiLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnIubWVzc2FnZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuXG5hc3luYyBmdW5jdGlvbiBnZXRFbXBsb3llZVRpbWVzaGVldChmaWxlbmFtZTogc3RyaW5nLCBidWZmZXI6IEJ1ZmZlciwgZW1wbG95ZWVfbmFtZTogc3RyaW5nLCBlbXBsb3llZV9pZDogc3RyaW5nKSB7XG4gICAgdHJ5IHtcblxuXG4gICAgICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLWhhaWt1LTIwMjQwMzA3LXYxOjBcIixcbiAgICAgICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtc29ubmV0LTIwMjQwMjI5LXYxOjBcIixcbiAgICAgICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDA2MjAtdjE6MDBcIixcbiAgICAgICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDEwMjItdjI6MFwiLFxuICAgICAgICAvLyBwcmVwYXJlIENsYXVkZSAzIHByb21wdFxuICAgICAgICBsZXQgZnVsbG5hbWUgPSBcIlwiXG4gICAgICAgIGlmIChlbXBsb3llZV9uYW1lKSB7XG4gICAgICAgICAgICBmdWxsbmFtZSA9IGBcIiR7ZW1wbG95ZWVfbmFtZX1cImBcbiAgICAgICAgfVxuICAgICAgICBpZiAoZW1wbG95ZWVfaWQpIHtcbiAgICAgICAgICAgIGZ1bGxuYW1lID0gYCR7ZnVsbG5hbWV9IChlbXBsb3llZSBpZCBpcyBcIiR7ZW1wbG95ZWVfaWR9XCIpYFxuICAgICAgICB9XG5cblxuICAgICAgICAvLyBHZXQgZmlsZSBleHRlbnNpb24gZnJvbSBtaW1ldHlwZSBvciBmaWxlbmFtZVxuICAgICAgICBjb25zdCBmaWxlRm9ybWF0OiBhbnkgPSBmaWxlbmFtZS5zcGxpdCgnLicpPy5wb3AoKT8udG9Mb3dlckNhc2UoKSB8fCBcIlwiO1xuXG4gICAgICAgIGNvbnN0IGlzSW1hZ2UgPSBbJ3BuZycsICdqcGVnJywgJ2pwZycsICdnaWYnLCAnd2VicCddLmluY2x1ZGVzKGZpbGVGb3JtYXQpO1xuICAgICAgICBjb25zdCBtb2RlbElkID0gaXNJbWFnZSA/IHByb2Nlc3MuZW52Lk1PREVMX0lEIDogJ3VzLmFtYXpvbi5ub3ZhLXByby12MTowJ1xuXG4gICAgICAgIC8vIERldGVybWluZSBtb2RlbCBiYXNlZCBvbiBmaWxlIHR5cGVcbiAgICAgICAgY29uc29sZS5sb2coXCJmaWxlLmZpbGVuYW1lXCIsIGZpbGVuYW1lKVxuICAgICAgICBjb25zb2xlLmxvZyhcImZpbGVGb3JtYXRcIiwgZmlsZUZvcm1hdClcbiAgICAgICAgY29uc29sZS5sb2coXCJzZWxlY3RlZCBtb2RlbFwiLCBtb2RlbElkKVxuXG4gICAgICAgIGNvbnN0IG1lbWJlciA9IGlzSW1hZ2UgPyB7XG4gICAgICAgICAgICBpbWFnZToge1xuICAgICAgICAgICAgICAgIGZvcm1hdDogZmlsZUZvcm1hdCxcbiAgICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgYnl0ZXM6IGJ1ZmZlclxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSA6IHtcbiAgICAgICAgICAgIGRvY3VtZW50OiB7XG4gICAgICAgICAgICAgICAgZm9ybWF0OiBmaWxlRm9ybWF0LFxuICAgICAgICAgICAgICAgIG5hbWU6IGZpbGVGb3JtYXQgKyBcIl9maWxlXCIsXG4gICAgICAgICAgICAgICAgc291cmNlOlxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBieXRlczogYnVmZmVyXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGlucHV0OiBDb252ZXJzZVJlcXVlc3QgPSB7XG4gICAgICAgICAgICBtb2RlbElkOiBtb2RlbElkLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLi4ubWVtYmVyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6IGBJIGFtIHByb3ZpZGluZyB5b3Ugd2l0aCBhbiBmaWxlIG9mIGEgdGltZXNoZWV0IGZvciBvbmUgb3IgbW9yZSBlbXBsb3llZXMuIEJhc2VkIG9uIHRoZSB2aXN1YWwgaW5mb3JtYXRpb24gYXZhaWxhYmxlLCBwbGVhc2UgYW5hbHl6ZSB0aGUgaW1hZ2UgYW5kIGdlbmVyYXRlIGEgSlNPTiBhcnJheSBmb3IganVzdCB0aGUgZW1wbG95ZWUgbmFtZWQgJHtmdWxsbmFtZX0gY29udGFpbmluZyBvYmplY3RzIHdpdGggZm9sbG93aW5nIGF0dHJpYnV0ZXMgd2hlbiBhdmFpbGFibGU6IHtzdGFydF9wZXJpb2Q6ZGF0ZSxlbmRfcGVyaW9kOmRhdGUsZGF5czphcnJheX0uRm9yIHRoZSAnc3RhcnRfcGVyaW9kJyBhbmQgJ2VuZF9wZXJpb2QnIGZpZWxkLCB5b3UgbmVlZCB0byBsb29rIGNhcmVmdWxseSBhdCB0aGUgd2hvbGUgZmlsZSB0byBmaW5kIHRoZSBcInNlbWFpbmVcIiBvciBcIndlZWtcIiBvciBcInBlcmlvZFwiIG9mIHRoZSB5ZWFyIChpdCBjYW4gYmUgbXVsdGlwbGUgZGF5cyBvciBqdXN0IG9uZSkgdGhhdCBoYXMgYmVlbiB3b3JrZWQgYW5kIHByb3ZpZGUgdGhlIGRhdGUgcmFuZ2UuIEZvciB0aGUgZW1wbG95ZWUgJHtmdWxsbmFtZX0gdGltZXNoZWV0IGRhdGEsIHlvdSBtYXkgZmluZCBvbmUgb3IgbXVsdGlwbGUgZGF5cyBhbmQgdGltZSB3aXRoaW4gdGhhdCBzdGFydCBhbmQgZW5kIHBlcmlvZC4gTWFrZSBzdXJlIHRoYXQgeW91IHByb3ZpZGUgZXZlcnkgdGltZSBwZXJpb2QgeW91IGZpbmQgZm9yIHRoZSBzcGVjaWZpZWQgZW1wbG95ZWUsIGV2ZW4gaWYgdGhlcmUgaXMgbXVsdGlwbGUgc3ViLXRvdGFsLiBZb3UgbmVlZCB0byBwcm92aWRlIGVhY2ggZGF5IChjb3VsZCBiZSBvbmUgb3IgbXVsdGlwbGUpIGluIHRoZSBcImRheXNcIiBhcnJheSBjb250YWluaW5nIDoge3dvcmtfZGF0ZTogZGF0ZSwgc3RhcnQ6ID90aW1lLCBlbmQ6ID90aW1lLCBsdW5jaF90aW1lIDogP251bWJlciwgb3ZlcnRpbWU6ID9udW1iZXIsIHdvcmtlZF9ob3VyczogP251bWJlcn0gZm9yIGVhY2ggd29yayB0aW1lIG9mIHRoZSBlbXBsb3llZS4gaWYgeW91IGRvbid0IGZpbmQgdGhlIGluZm9ybWF0aW9uIGZvciBvbmUgb2YgZmllbGRzIFwic3RhcnRcIiAsIFwiZW5kXCIsIFwibHVuY2hfdGltZVwiLCBcIm92ZXJ0aW1lXCIsICBvciBcIndvcmtlZF9ob3Vyc1wiLCB5b3UgbXVzdCBub3QgaW5jbHVkZSB0aGUgZmllbGQgaW4gdGhlIEpTT04uIE1ha2Ugc3VyZSB0aGUgSlNPTiBvYmplY3QgaXMgcHJvcGVybHkgZm9ybWF0dGVkIHdpdGggY29ycmVjdCBhdHRyaWJ1dGUgbmFtZXMgYW5kIHZhbHVlcyBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGVzIHdoZW4gbmVlZGVkLiBTa2lwIHByZWFtYnVsZSBhbmQgb25seSBnaXZlIGEgdmFsaWQgZnVsbCBKU09OIGluIHlvdXIgcmVzcG9uc2UgY29udGFpbmluZyB0aGUgc3BlY2lmaWVkIGVtcGxveWVlIGluZm9ybWF0aW9uIHdpdGhvdXQgYW55dGhpbmcgZWxzZSAobm90ZSwgY29tbWVudCwgcGhyYXNlKSBleGNlcHQgdGhlIEpTT04uYFxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgXVxuICAgICAgICB9O1xuXG5cbiAgICAgICAgLy8gQ3JlYXRlIGEgY29tbWFuZCBvYmplY3Qgd2l0aCB0aGUgcmVxdWVzdCBpbmZvcm1hdGlvblxuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IENvbnZlcnNlQ29tbWFuZChpbnB1dCk7XG5cbiAgICAgICAgLy8gVXNlIHRoZSBjbGllbnQgdG8gc2VuZCB0aGUgY29tbWFuZCB0byBBbWF6b24gQmVkcm9ja1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGJlZHJvY2tDbGllbnQuc2VuZChjb21tYW5kKVxuXG4gICAgICAgIC8vIFBhcnNlIHRoZSBhbnN3ZXJcbiAgICAgICAgLy9jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJyZXNwb25zZS5ib2R5IDogXCIsdGV4dERlY29kZXIuZGVjb2RlKHJlc3BvbnNlLmJvZHkpKVxuICAgICAgICAvL2NvbnN0IHJlc3BvbnNlX2JvZHkgPSBKU09OLnBhcnNlKHRleHREZWNvZGVyLmRlY29kZShyZXNwb25zZS5ib2R5KSlcblxuICAgICAgICBjb25zdCBvdXRwdXRNZXNzYWdlID0gcmVzcG9uc2Uub3V0cHV0Py5tZXNzYWdlXG4gICAgICAgIGxldCB0aW1lc2hlZXRJbmZvID0gb3V0cHV0TWVzc2FnZT8uY29udGVudD8uYXQoMCk/LnRleHQgfHwgXCJcIjtcbiAgICAgICAgdGltZXNoZWV0SW5mbyA9IHRpbWVzaGVldEluZm8ucmVwbGFjZShcImBgYGpzb25cIiwgXCJcIilcbiAgICAgICAgdGltZXNoZWV0SW5mbyA9IHRpbWVzaGVldEluZm8ucmVwbGFjZShcImBgYFwiLCBcIlwiKVxuXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2UuYm9keSA6IFwiLCB0aW1lc2hlZXRJbmZvKVxuXG4gICAgICAgIC8vIFRPRE8gOiBJTlZPS0UgQW1hem9uIEJlZHJvY2sgR3VhcmRyYWlscyB0byB2ZXJpZnkgdGhlIG91dHB1dCByZXNwb25zZV9ib2R5XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgICAgICAgIHRpbWVzaGVldEluZm9cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbnZva2luZyBCZWRyb2NrOlwiLCBlcnIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7XCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCJ9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIHVwbG9hZCB0aGUgZmlsZVwiLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnIubWVzc2FnZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IHtnZXRFbXBsb3llZVRpbWVzaGVldCwgZ2V0RW1wbG95ZWVMaXN0fVxuIl19