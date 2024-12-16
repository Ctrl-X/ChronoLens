"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEmployeeList = exports.getEmployeeTimesheet = void 0;
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime"); // ES Modules import
// Initialize the Bedrock client with your region
const bedrockClient = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: "us-west-2" });
const { ApplyGuardrailCommand } = require("@aws-sdk/client-bedrock");
async function getEmployeeList(file) {
    var _a, _b, _c;
    // Convert file Buffer to a Base64 string
    const buffer = Buffer.from(file.content, "binary");
    const base64file = buffer.toString("base64");
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
    const input = {
        modelId: process.env.MODEL_ID,
        messages: [
            {
                role: "user",
                content: [
                    {
                        image: {
                            format: "jpeg",
                            source: {
                                bytes: buffer
                            }
                        }
                    },
                    {
                        text: "I am providing you with an file of a timesheet for one or multiple employees. Based on the visual information available, please analyze the image and generate a JSON array of \"employees\" object containing the following attributes when available: \"name\", \"id\". In addition ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed.If you don't find the information for \"employee_id\", you have to omit the field. Skip preambule and only give a valid full JSON in your response containing all employees without anything else (note, comment, phrase) except the JSON."
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
        const outputMessage = (_a = response.output) === null || _a === void 0 ? void 0 : _a.message;
        console.log("response.body : ", outputMessage);
        //const response_body = JSON.parse(outputMessage)
        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body
        // Return the product information
        //const employeeInfo = JSON.parse(response_body.content[0].text)
        const employeeInfo = (_c = (_b = outputMessage === null || outputMessage === void 0 ? void 0 : outputMessage.content) === null || _b === void 0 ? void 0 : _b.at(0)) === null || _c === void 0 ? void 0 : _c.text;
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
async function getEmployeeTimesheet(file, employee_name, employee_id) {
    var _a;
    // Convert file Buffer to a Base64 string
    const buffer = Buffer.from(file.content, "binary");
    const base64file = buffer.toString("base64");
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
    /*const params = {
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
                            "text": `I am providing you with an file of a timesheet for one or more employees. Based on the visual information available, please analyze the image and generate a JSON array for just the employee named ${fullname} containing objects with following attributes when available: {employee_name:string,employee_id:string,pay_period:string,days:array}.For the same employee named ${fullname}, you will find one or multiple days and time that you need to provide in the "days" array containing : {work_date: date, start: time, end: time, lunch_time : number, overtime: number, worked_hours: number} for each work time of the employee.  Make sure the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed.If you don't find the information for a field, you have to omit the field. Skip preambule and only give a valid full JSON in your response containing the specified employee information without anything else (note, comment, phrase) except the JSON. Here is the image:`
                        }
                    ]
                }
            ]
        })
    }
*/
    /*
    Prompt for Nova :
    I am providing you with an file of a timesheet for one or more employees. Based on the visual information available, please analyze the image and generate a JSON array for just the employee named "Mohamed Amine Samlak" containing objects with following attributes when available: {employee_name:string,employee_id:string,pay_period:string,sum_worked_hours:number,days:array}.For the same employee named "Mohamed Amine Samlak", you will find one or multiple days and time that you need to provide in the "days" array containing : {work_date: date, start: ?time, end: ?time, lunch_time : ?number, overtime: ?number, worked_hours: ?number} for each work time of the employee. Make sure the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed but if you don't find the information for one of fields "start" , "end", "lunch_time", "overtime",  or "worked_hours"), you must not include the field in the JSON. Skip preambule and only give a valid full JSON in your response containing the specified employee information without anything else (note, comment, phrase) except the JSON.
    */
    const input = {
        modelId: process.env.MODEL_ID,
        messages: [
            {
                role: "user",
                content: [
                    {
                        image: {
                            format: "jpeg",
                            source: {
                                bytes: buffer
                            }
                        }
                    },
                    {
                        text: `I am providing you with an file of a timesheet for one or more employees. Based on the visual information available, please analyze the image and generate a JSON array for just the employee named ${fullname} containing objects with following attributes when available: {employee_name:string,employee_id:string,pay_period:string,sum_worked_hours:number,days:array}.For the same employee named ${fullname}, you will find one or multiple days and time that you need to provide in the "days" array containing : {work_date: date, start: ?time, end: ?time, lunch_time : ?number, overtime: ?number, worked_hours: ?number} for each work time of the employee. Make sure the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed but if you don't find the information for one of fields "start" , "end", "lunch_time", "overtime",  or "worked_hours", you must not include the field in the JSON. Skip preambule and only give a valid full JSON in your response containing the specified employee information without anything else (note, comment, phrase) except the JSON.`
                    }
                ]
            }
        ]
    };
    try {
        // Create a command object with the request information
        const command = new client_bedrock_runtime_1.ConverseCommand(input);
        // Use the client to send the command to Amazon Bedrock
        const response = await bedrockClient.send(command);
        // Parse the answer
        //const textDecoder = new TextDecoder("utf-8")
        //console.log("response.body : ",textDecoder.decode(response.body))
        //const response_body = JSON.parse(textDecoder.decode(response.body))
        const timesheetInfo = (_a = response.output) === null || _a === void 0 ? void 0 : _a.message;
        console.log("response.body : ", timesheetInfo);
        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body
        // Return the product information
        //const timesheetInfo = JSON.parse(response_body.output.message.content[0].text)
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVkcm9ja1V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmVkcm9ja1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLDRFQUF1RyxDQUFDLG9CQUFvQjtBQUU1SCxpREFBaUQ7QUFDakQsTUFBTSxhQUFhLEdBQUcsSUFBSSw2Q0FBb0IsQ0FBQyxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsQ0FBQyxDQUFBO0FBQ3ZFLE1BQU0sRUFBRSxxQkFBcUIsRUFBRSxHQUFHLE9BQU8sQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO0FBR3BFLEtBQUssVUFBVSxlQUFlLENBQUMsSUFBUzs7SUFDcEMseUNBQXlDO0lBQ3pDLE1BQU0sTUFBTSxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQTtJQUNsRCxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRTVDLHFEQUFxRDtJQUNyRCxzREFBc0Q7SUFDdEQseURBQXlEO0lBQ3pELHdEQUF3RDtJQUN4RCwwQkFBMEI7SUFDN0I7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBNkJDO0lBRUUsTUFBTSxLQUFLLEdBQW9CO1FBQzNCLE9BQU8sRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLFFBQVE7UUFDN0IsUUFBUSxFQUFFO1lBQ047Z0JBQ0ksSUFBSSxFQUFFLE1BQU07Z0JBQ1osT0FBTyxFQUFFO29CQUNMO3dCQUNJLEtBQUssRUFBRTs0QkFDSCxNQUFNLEVBQUUsTUFBTTs0QkFDZCxNQUFNLEVBQUU7Z0NBQ0osS0FBSyxFQUFFLE1BQU07NkJBQ2hCO3lCQUNKO3FCQUNKO29CQUNEO3dCQUNJLElBQUksRUFBRSxrb0JBQWtvQjtxQkFDM29CO2lCQUNKO2FBQ0o7U0FDSjtLQUNKLENBQUM7SUFFRixJQUFJLENBQUM7UUFDRCxPQUFPLENBQUMsR0FBRyxDQUFDLDRCQUE0QixFQUFDLEtB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QzlDLG1FQUFtRTtRQUNuRSxxRUFBcUU7UUFFckUsTUFBTSxhQUFhLEdBQUUsTUFBQSxRQUFRLENBQUMsTUFBTSwwQ0FBRSxPQUFPLENBQUE7UUFDN0MsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBQyxhQUFhLENBQUMsQ0FBQTtRQUU3Qyw2RUFBNkU7UUFFN0UsaUNBQWlDO1FBQ2pDLGdGQUFnRjtRQUNoRixPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixhQUFhO1NBQ2hCLENBQUE7SUFDTCxDQUFDO0lBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzdDLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRTtZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDakIsT0FBTyxFQUFFLDJCQUEyQjtnQkFDcEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2FBQ3JCLENBQUM7U0FDTCxDQUFBO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFFTyxvREFBb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0JlZHJvY2tSdW50aW1lQ2xpZW50LCBDb252ZXJzZUNvbW1hbmQsIENvbnZlcnNlUmVxdWVzdH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1iZWRyb2NrLXJ1bnRpbWVcIjsgLy8gRVMgTW9kdWxlcyBpbXBvcnRcblxuLy8gSW5pdGlhbGl6ZSB0aGUgQmVkcm9jayBjbGllbnQgd2l0aCB5b3VyIHJlZ2lvblxuY29uc3QgYmVkcm9ja0NsaWVudCA9IG5ldyBCZWRyb2NrUnVudGltZUNsaWVudCh7IHJlZ2lvbjogXCJ1cy13ZXN0LTJcIiB9KVxuY29uc3QgeyBBcHBseUd1YXJkcmFpbENvbW1hbmQgfSA9IHJlcXVpcmUoXCJAYXdzLXNkay9jbGllbnQtYmVkcm9ja1wiKVxuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldEVtcGxveWVlTGlzdChmaWxlOiBhbnkpIHtcbiAgICAvLyBDb252ZXJ0IGZpbGUgQnVmZmVyIHRvIGEgQmFzZTY0IHN0cmluZ1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGZpbGUuY29udGVudCwgXCJiaW5hcnlcIilcbiAgICBjb25zdCBiYXNlNjRmaWxlID0gYnVmZmVyLnRvU3RyaW5nKFwiYmFzZTY0XCIpXG5cbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1oYWlrdS0yMDI0MDMwNy12MTowXCIsXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtc29ubmV0LTIwMjQwMjI5LXYxOjBcIixcbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy01LXNvbm5ldC0yMDI0MDYyMC12MTowMFwiLFxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLTUtc29ubmV0LTIwMjQxMDIyLXYyOjBcIixcbiAgICAvLyBwcmVwYXJlIENsYXVkZSAzIHByb21wdFxuIC8qICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBtb2RlbElkOiBwcm9jZXNzLmVudi5NT0RFTF9JRCxcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBhbnRocm9waWNfdmVyc2lvbjogXCJiZWRyb2NrLTIwMjMtMDUtMzFcIixcbiAgICAgICAgICAgIG1heF90b2tlbnM6IDIwNDgsXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogMCxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzb3VyY2VcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJiYXNlNjRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWRpYV90eXBlXCI6IFwiaW1hZ2UvanBlZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogYmFzZTY0ZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkkgYW0gcHJvdmlkaW5nIHlvdSB3aXRoIGFuIGZpbGUgb2YgYSB0aW1lc2hlZXQgZm9yIG9uZSBvciBtdWx0aXBsZSBlbXBsb3llZXMuIEJhc2VkIG9uIHRoZSB2aXN1YWwgaW5mb3JtYXRpb24gYXZhaWxhYmxlLCBwbGVhc2UgYW5hbHl6ZSB0aGUgaW1hZ2UgYW5kIGdlbmVyYXRlIGEgSlNPTiBhcnJheSBvZiBcXFwiZW1wbG95ZWVzXFxcIiBvYmplY3QgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXMgd2hlbiBhdmFpbGFibGU6IFxcXCJlbXBsb3llZV9uYW1lXFxcIiwgXFxcImVtcGxveWVlX2lkXFxcIi4gSW4gYWRkaXRpb24gZW5zdXJlIHRoYXQgdGhlIEpTT04gb2JqZWN0IGlzIHByb3Blcmx5IGZvcm1hdHRlZCB3aXRoIGNvcnJlY3QgYXR0cmlidXRlIG5hbWVzIGFuZCB2YWx1ZXMgZW5jbG9zZWQgaW4gZG91YmxlIHF1b3RlcyB3aGVuIG5lZWRlZC5JZiB5b3UgZG9uJ3QgZmluZCB0aGUgaW5mb3JtYXRpb24gZm9yIFxcXCJlbXBsb3llZV9pZFxcXCIsIHlvdSBoYXZlIHRvIG9taXQgdGhlIGZpZWxkLiBTa2lwIHByZWFtYnVsZSBhbmQgb25seSBnaXZlIGEgdmFsaWQgZnVsbCBKU09OIGluIHlvdXIgcmVzcG9uc2UgY29udGFpbmluZyBhbGwgZW1wbG95ZWVzIHdpdGhvdXQgYW55dGhpbmcgZWxzZSAobm90ZSwgY29tbWVudCwgcGhyYXNlKSBleGNlcHQgdGhlIEpTT04uIEhlcmUgaXMgdGhlIGltYWdlOlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgfVxuKi9cblxuICAgIGNvbnN0IGlucHV0OiBDb252ZXJzZVJlcXVlc3QgPSB7IC8vIENvbnZlcnNlUmVxdWVzdFxuICAgICAgICBtb2RlbElkOiBwcm9jZXNzLmVudi5NT0RFTF9JRCxcbiAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcImpwZWdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZXM6IGJ1ZmZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogXCJJIGFtIHByb3ZpZGluZyB5b3Ugd2l0aCBhbiBmaWxlIG9mIGEgdGltZXNoZWV0IGZvciBvbmUgb3IgbXVsdGlwbGUgZW1wbG95ZWVzLiBCYXNlZCBvbiB0aGUgdmlzdWFsIGluZm9ybWF0aW9uIGF2YWlsYWJsZSwgcGxlYXNlIGFuYWx5emUgdGhlIGltYWdlIGFuZCBnZW5lcmF0ZSBhIEpTT04gYXJyYXkgb2YgXFxcImVtcGxveWVlc1xcXCIgb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzIHdoZW4gYXZhaWxhYmxlOiBcXFwibmFtZVxcXCIsIFxcXCJpZFxcXCIuIEluIGFkZGl0aW9uIGVuc3VyZSB0aGF0IHRoZSBKU09OIG9iamVjdCBpcyBwcm9wZXJseSBmb3JtYXR0ZWQgd2l0aCBjb3JyZWN0IGF0dHJpYnV0ZSBuYW1lcyBhbmQgdmFsdWVzIGVuY2xvc2VkIGluIGRvdWJsZSBxdW90ZXMgd2hlbiBuZWVkZWQuSWYgeW91IGRvbid0IGZpbmQgdGhlIGluZm9ybWF0aW9uIGZvciBcXFwiZW1wbG95ZWVfaWRcXFwiLCB5b3UgaGF2ZSB0byBvbWl0IHRoZSBmaWVsZC4gU2tpcCBwcmVhbWJ1bGUgYW5kIG9ubHkgZ2l2ZSBhIHZhbGlkIGZ1bGwgSlNPTiBpbiB5b3VyIHJlc3BvbnNlIGNvbnRhaW5pbmcgYWxsIGVtcGxveWVlcyB3aXRob3V0IGFueXRoaW5nIGVsc2UgKG5vdGUsIGNvbW1lbnQsIHBocmFzZSkgZXhjZXB0IHRoZSBKU09OLlwiXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICB9XG4gICAgICAgIF1cbiAgICB9O1xuXG4gICAgdHJ5IHtcbiAgICAgICAgY29uc29sZS5sb2coXCJjYWxsaW5nIENvbnZlcnNlQ29tbWFuZCA6IFwiLGlucHV0KVxuICAgICAgICAvLyBDcmVhdGUgYSBjb21tYW5kIG9iamVjdCB3aXRoIHRoZSByZXF1ZXN0IGluZm9ybWF0aW9uXG4gICAgICAgIC8vY29uc3QgY29tbWFuZCA9IG5ldyBJbnZva2VNb2RlbENvbW1hbmQocGFyYW1zKVxuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IENvbnZlcnNlQ29tbWFuZChpbnB1dCk7XG5cbiAgICAgICAgLy8gVXNlIHRoZSBjbGllbnQgdG8gc2VuZCB0aGUgY29tbWFuZCB0byBBbWF6b24gQmVkcm9ja1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGJlZHJvY2tDbGllbnQuc2VuZChjb21tYW5kKVxuXG4gICAgICAgIC8vIFBhcnNlIHRoZSBhbnN3ZXJcbiAgICAgICAgY29uc3Qgb3V0cHV0TWVzc2FnZT0gcmVzcG9uc2Uub3V0cHV0Py5tZXNzYWdlXG4gICAgICAgIGNvbnNvbGUubG9nKFwicmVzcG9uc2UuYm9keSA6IFwiLG91dHB1dE1lc3NhZ2UpXG4gICAgICAgIC8vY29uc3QgcmVzcG9uc2VfYm9keSA9IEpTT04ucGFyc2Uob3V0cHV0TWVzc2FnZSlcblxuICAgICAgICAvLyBUT0RPIDogSU5WT0tFIEFtYXpvbiBCZWRyb2NrIEd1YXJkcmFpbHMgdG8gdmVyaWZ5IHRoZSBvdXRwdXQgcmVzcG9uc2VfYm9keVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJvZHVjdCBpbmZvcm1hdGlvblxuICAgICAgICAvL2NvbnN0IGVtcGxveWVlSW5mbyA9IEpTT04ucGFyc2UocmVzcG9uc2VfYm9keS5jb250ZW50WzBdLnRleHQpXG4gICAgICAgIGNvbnN0IGVtcGxveWVlSW5mbyA9IG91dHB1dE1lc3NhZ2U/LmNvbnRlbnQ/LmF0KDApPy50ZXh0O1xuXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgICAgICBlbXBsb3llZUluZm9cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbnZva2luZyBCZWRyb2NrOlwiLCBlcnIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gdXBsb2FkIHRoZSBmaWxlXCIsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbmFzeW5jIGZ1bmN0aW9uIGdldEVtcGxveWVlVGltZXNoZWV0KGZpbGU6IGFueSwgZW1wbG95ZWVfbmFtZTpzdHJpbmcsIGVtcGxveWVlX2lkOnN0cmluZykge1xuICAgIC8vIENvbnZlcnQgZmlsZSBCdWZmZXIgdG8gYSBCYXNlNjQgc3RyaW5nXG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oZmlsZS5jb250ZW50LCBcImJpbmFyeVwiKVxuICAgIGNvbnN0IGJhc2U2NGZpbGUgPSBidWZmZXIudG9TdHJpbmcoXCJiYXNlNjRcIilcblxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLWhhaWt1LTIwMjQwMzA3LXYxOjBcIixcbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1zb25uZXQtMjAyNDAyMjktdjE6MFwiLFxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLTUtc29ubmV0LTIwMjQwNjIwLXYxOjAwXCIsXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDEwMjItdjI6MFwiLFxuICAgIC8vIHByZXBhcmUgQ2xhdWRlIDMgcHJvbXB0XG4gICAgbGV0IGZ1bGxuYW1lID0gXCJcIlxuICAgIGlmKGVtcGxveWVlX25hbWUpe1xuICAgICAgICBmdWxsbmFtZSA9IGBcIiR7ZW1wbG95ZWVfbmFtZX1cImBcbiAgICB9XG4gICAgaWYoZW1wbG95ZWVfaWQpe1xuICAgICAgICBmdWxsbmFtZSA9IGAke2Z1bGxuYW1lfSAoZW1wbG95ZWUgaWQgaXMgXCIke2VtcGxveWVlX2lkfVwiKWBcbiAgICB9XG4gICAgLypjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIG1vZGVsSWQ6IHByb2Nlc3MuZW52Lk1PREVMX0lELFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGFudGhyb3BpY192ZXJzaW9uOiBcImJlZHJvY2stMjAyMy0wNS0zMVwiLFxuICAgICAgICAgICAgbWF4X3Rva2VuczogMjA0OCxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJhc2U2NFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lZGlhX3R5cGVcIjogXCJpbWFnZS9qcGVnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBiYXNlNjRmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IGBJIGFtIHByb3ZpZGluZyB5b3Ugd2l0aCBhbiBmaWxlIG9mIGEgdGltZXNoZWV0IGZvciBvbmUgb3IgbW9yZSBlbXBsb3llZXMuIEJhc2VkIG9uIHRoZSB2aXN1YWwgaW5mb3JtYXRpb24gYXZhaWxhYmxlLCBwbGVhc2UgYW5hbHl6ZSB0aGUgaW1hZ2UgYW5kIGdlbmVyYXRlIGEgSlNPTiBhcnJheSBmb3IganVzdCB0aGUgZW1wbG95ZWUgbmFtZWQgJHtmdWxsbmFtZX0gY29udGFpbmluZyBvYmplY3RzIHdpdGggZm9sbG93aW5nIGF0dHJpYnV0ZXMgd2hlbiBhdmFpbGFibGU6IHtlbXBsb3llZV9uYW1lOnN0cmluZyxlbXBsb3llZV9pZDpzdHJpbmcscGF5X3BlcmlvZDpzdHJpbmcsZGF5czphcnJheX0uRm9yIHRoZSBzYW1lIGVtcGxveWVlIG5hbWVkICR7ZnVsbG5hbWV9LCB5b3Ugd2lsbCBmaW5kIG9uZSBvciBtdWx0aXBsZSBkYXlzIGFuZCB0aW1lIHRoYXQgeW91IG5lZWQgdG8gcHJvdmlkZSBpbiB0aGUgXCJkYXlzXCIgYXJyYXkgY29udGFpbmluZyA6IHt3b3JrX2RhdGU6IGRhdGUsIHN0YXJ0OiB0aW1lLCBlbmQ6IHRpbWUsIGx1bmNoX3RpbWUgOiBudW1iZXIsIG92ZXJ0aW1lOiBudW1iZXIsIHdvcmtlZF9ob3VyczogbnVtYmVyfSBmb3IgZWFjaCB3b3JrIHRpbWUgb2YgdGhlIGVtcGxveWVlLiAgTWFrZSBzdXJlIHRoZSBKU09OIG9iamVjdCBpcyBwcm9wZXJseSBmb3JtYXR0ZWQgd2l0aCBjb3JyZWN0IGF0dHJpYnV0ZSBuYW1lcyBhbmQgdmFsdWVzIGVuY2xvc2VkIGluIGRvdWJsZSBxdW90ZXMgd2hlbiBuZWVkZWQuSWYgeW91IGRvbid0IGZpbmQgdGhlIGluZm9ybWF0aW9uIGZvciBhIGZpZWxkLCB5b3UgaGF2ZSB0byBvbWl0IHRoZSBmaWVsZC4gU2tpcCBwcmVhbWJ1bGUgYW5kIG9ubHkgZ2l2ZSBhIHZhbGlkIGZ1bGwgSlNPTiBpbiB5b3VyIHJlc3BvbnNlIGNvbnRhaW5pbmcgdGhlIHNwZWNpZmllZCBlbXBsb3llZSBpbmZvcm1hdGlvbiB3aXRob3V0IGFueXRoaW5nIGVsc2UgKG5vdGUsIGNvbW1lbnQsIHBocmFzZSkgZXhjZXB0IHRoZSBKU09OLiBIZXJlIGlzIHRoZSBpbWFnZTpgXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgfVxuKi9cbiAgICAvKlxuICAgIFByb21wdCBmb3IgTm92YSA6XG4gICAgSSBhbSBwcm92aWRpbmcgeW91IHdpdGggYW4gZmlsZSBvZiBhIHRpbWVzaGVldCBmb3Igb25lIG9yIG1vcmUgZW1wbG95ZWVzLiBCYXNlZCBvbiB0aGUgdmlzdWFsIGluZm9ybWF0aW9uIGF2YWlsYWJsZSwgcGxlYXNlIGFuYWx5emUgdGhlIGltYWdlIGFuZCBnZW5lcmF0ZSBhIEpTT04gYXJyYXkgZm9yIGp1c3QgdGhlIGVtcGxveWVlIG5hbWVkIFwiTW9oYW1lZCBBbWluZSBTYW1sYWtcIiBjb250YWluaW5nIG9iamVjdHMgd2l0aCBmb2xsb3dpbmcgYXR0cmlidXRlcyB3aGVuIGF2YWlsYWJsZToge2VtcGxveWVlX25hbWU6c3RyaW5nLGVtcGxveWVlX2lkOnN0cmluZyxwYXlfcGVyaW9kOnN0cmluZyxzdW1fd29ya2VkX2hvdXJzOm51bWJlcixkYXlzOmFycmF5fS5Gb3IgdGhlIHNhbWUgZW1wbG95ZWUgbmFtZWQgXCJNb2hhbWVkIEFtaW5lIFNhbWxha1wiLCB5b3Ugd2lsbCBmaW5kIG9uZSBvciBtdWx0aXBsZSBkYXlzIGFuZCB0aW1lIHRoYXQgeW91IG5lZWQgdG8gcHJvdmlkZSBpbiB0aGUgXCJkYXlzXCIgYXJyYXkgY29udGFpbmluZyA6IHt3b3JrX2RhdGU6IGRhdGUsIHN0YXJ0OiA/dGltZSwgZW5kOiA/dGltZSwgbHVuY2hfdGltZSA6ID9udW1iZXIsIG92ZXJ0aW1lOiA/bnVtYmVyLCB3b3JrZWRfaG91cnM6ID9udW1iZXJ9IGZvciBlYWNoIHdvcmsgdGltZSBvZiB0aGUgZW1wbG95ZWUuIE1ha2Ugc3VyZSB0aGUgSlNPTiBvYmplY3QgaXMgcHJvcGVybHkgZm9ybWF0dGVkIHdpdGggY29ycmVjdCBhdHRyaWJ1dGUgbmFtZXMgYW5kIHZhbHVlcyBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGVzIHdoZW4gbmVlZGVkIGJ1dCBpZiB5b3UgZG9uJ3QgZmluZCB0aGUgaW5mb3JtYXRpb24gZm9yIG9uZSBvZiBmaWVsZHMgXCJzdGFydFwiICwgXCJlbmRcIiwgXCJsdW5jaF90aW1lXCIsIFwib3ZlcnRpbWVcIiwgIG9yIFwid29ya2VkX2hvdXJzXCIpLCB5b3UgbXVzdCBub3QgaW5jbHVkZSB0aGUgZmllbGQgaW4gdGhlIEpTT04uIFNraXAgcHJlYW1idWxlIGFuZCBvbmx5IGdpdmUgYSB2YWxpZCBmdWxsIEpTT04gaW4geW91ciByZXNwb25zZSBjb250YWluaW5nIHRoZSBzcGVjaWZpZWQgZW1wbG95ZWUgaW5mb3JtYXRpb24gd2l0aG91dCBhbnl0aGluZyBlbHNlIChub3RlLCBjb21tZW50LCBwaHJhc2UpIGV4Y2VwdCB0aGUgSlNPTi5cbiAgICAqL1xuXG4gICAgY29uc3QgaW5wdXQ6Q29udmVyc2VSZXF1ZXN0ID0ge1xuICAgICAgICBtb2RlbElkOiBwcm9jZXNzLmVudi5NT0RFTF9JRCxcbiAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltYWdlOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiBcImpwZWdcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2U6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZXM6IGJ1ZmZlclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogYEkgYW0gcHJvdmlkaW5nIHlvdSB3aXRoIGFuIGZpbGUgb2YgYSB0aW1lc2hlZXQgZm9yIG9uZSBvciBtb3JlIGVtcGxveWVlcy4gQmFzZWQgb24gdGhlIHZpc3VhbCBpbmZvcm1hdGlvbiBhdmFpbGFibGUsIHBsZWFzZSBhbmFseXplIHRoZSBpbWFnZSBhbmQgZ2VuZXJhdGUgYSBKU09OIGFycmF5IGZvciBqdXN0IHRoZSBlbXBsb3llZSBuYW1lZCAke2Z1bGxuYW1lfSBjb250YWluaW5nIG9iamVjdHMgd2l0aCBmb2xsb3dpbmcgYXR0cmlidXRlcyB3aGVuIGF2YWlsYWJsZToge2VtcGxveWVlX25hbWU6c3RyaW5nLGVtcGxveWVlX2lkOnN0cmluZyxwYXlfcGVyaW9kOnN0cmluZyxzdW1fd29ya2VkX2hvdXJzOm51bWJlcixkYXlzOmFycmF5fS5Gb3IgdGhlIHNhbWUgZW1wbG95ZWUgbmFtZWQgJHtmdWxsbmFtZX0sIHlvdSB3aWxsIGZpbmQgb25lIG9yIG11bHRpcGxlIGRheXMgYW5kIHRpbWUgdGhhdCB5b3UgbmVlZCB0byBwcm92aWRlIGluIHRoZSBcImRheXNcIiBhcnJheSBjb250YWluaW5nIDoge3dvcmtfZGF0ZTogZGF0ZSwgc3RhcnQ6ID90aW1lLCBlbmQ6ID90aW1lLCBsdW5jaF90aW1lIDogP251bWJlciwgb3ZlcnRpbWU6ID9udW1iZXIsIHdvcmtlZF9ob3VyczogP251bWJlcn0gZm9yIGVhY2ggd29yayB0aW1lIG9mIHRoZSBlbXBsb3llZS4gTWFrZSBzdXJlIHRoZSBKU09OIG9iamVjdCBpcyBwcm9wZXJseSBmb3JtYXR0ZWQgd2l0aCBjb3JyZWN0IGF0dHJpYnV0ZSBuYW1lcyBhbmQgdmFsdWVzIGVuY2xvc2VkIGluIGRvdWJsZSBxdW90ZXMgd2hlbiBuZWVkZWQgYnV0IGlmIHlvdSBkb24ndCBmaW5kIHRoZSBpbmZvcm1hdGlvbiBmb3Igb25lIG9mIGZpZWxkcyBcInN0YXJ0XCIgLCBcImVuZFwiLCBcImx1bmNoX3RpbWVcIiwgXCJvdmVydGltZVwiLCAgb3IgXCJ3b3JrZWRfaG91cnNcIiwgeW91IG11c3Qgbm90IGluY2x1ZGUgdGhlIGZpZWxkIGluIHRoZSBKU09OLiBTa2lwIHByZWFtYnVsZSBhbmQgb25seSBnaXZlIGEgdmFsaWQgZnVsbCBKU09OIGluIHlvdXIgcmVzcG9uc2UgY29udGFpbmluZyB0aGUgc3BlY2lmaWVkIGVtcGxveWVlIGluZm9ybWF0aW9uIHdpdGhvdXQgYW55dGhpbmcgZWxzZSAobm90ZSwgY29tbWVudCwgcGhyYXNlKSBleGNlcHQgdGhlIEpTT04uYFxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgfVxuICAgICAgICBdXG4gICAgfTtcblxuXG4gICAgdHJ5IHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29tbWFuZCBvYmplY3Qgd2l0aCB0aGUgcmVxdWVzdCBpbmZvcm1hdGlvblxuICAgICAgICBjb25zdCBjb21tYW5kID0gbmV3IENvbnZlcnNlQ29tbWFuZChpbnB1dCk7XG5cbiAgICAgICAgLy8gVXNlIHRoZSBjbGllbnQgdG8gc2VuZCB0aGUgY29tbWFuZCB0byBBbWF6b24gQmVkcm9ja1xuICAgICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGJlZHJvY2tDbGllbnQuc2VuZChjb21tYW5kKVxuXG4gICAgICAgIC8vIFBhcnNlIHRoZSBhbnN3ZXJcbiAgICAgICAgLy9jb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpXG4gICAgICAgIC8vY29uc29sZS5sb2coXCJyZXNwb25zZS5ib2R5IDogXCIsdGV4dERlY29kZXIuZGVjb2RlKHJlc3BvbnNlLmJvZHkpKVxuICAgICAgICAvL2NvbnN0IHJlc3BvbnNlX2JvZHkgPSBKU09OLnBhcnNlKHRleHREZWNvZGVyLmRlY29kZShyZXNwb25zZS5ib2R5KSlcblxuICAgICAgICBjb25zdCB0aW1lc2hlZXRJbmZvPSByZXNwb25zZS5vdXRwdXQ/Lm1lc3NhZ2VcbiAgICAgICAgY29uc29sZS5sb2coXCJyZXNwb25zZS5ib2R5IDogXCIsdGltZXNoZWV0SW5mbylcblxuICAgICAgICAvLyBUT0RPIDogSU5WT0tFIEFtYXpvbiBCZWRyb2NrIEd1YXJkcmFpbHMgdG8gdmVyaWZ5IHRoZSBvdXRwdXQgcmVzcG9uc2VfYm9keVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJvZHVjdCBpbmZvcm1hdGlvblxuICAgICAgICAvL2NvbnN0IHRpbWVzaGVldEluZm8gPSBKU09OLnBhcnNlKHJlc3BvbnNlX2JvZHkub3V0cHV0Lm1lc3NhZ2UuY29udGVudFswXS50ZXh0KVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICAgICAgdGltZXNoZWV0SW5mb1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGludm9raW5nIEJlZHJvY2s6XCIsIGVycilcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkZhaWxlZCB0byB1cGxvYWQgdGhlIGZpbGVcIixcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyLm1lc3NhZ2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCB7Z2V0RW1wbG95ZWVUaW1lc2hlZXQsIGdldEVtcGxveWVlTGlzdH1cbiJdfQ==