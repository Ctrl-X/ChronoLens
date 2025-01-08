import {
    BedrockRuntimeClient,
    ConverseCommand,
    ConverseRequest,
    DocumentBlock,
    ImageBlock
} from "@aws-sdk/client-bedrock-runtime";

// Initialize the Bedrock client with your region
const bedrockClient = new BedrockRuntimeClient({region: "us-west-2"})
const {ApplyGuardrailCommand} = require("@aws-sdk/client-bedrock")


async function getEmployeeList(file: any) {
    // Convert file Buffer to a Base64 string
    const buffer = Buffer.from(file.content, "binary")

    // Get file extension from mimetype or filename
    const fileFormat: any = file.filename.split('.')?.pop()?.toLowerCase() || "";

    const isImage = ['png', 'jpeg', 'jpg', 'gif', 'webp'].includes(fileFormat);
    const modelId = isImage ? process.env.MODEL_ID : 'us.amazon.nova-pro-v1:0'

    // Determine model based on file type
    console.log("file.filename", file.filename)
    console.log("fileFormat", fileFormat)
    console.log("selected model", modelId)

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
            source:
                {
                    bytes: buffer
                }
        }
    }
    const input: ConverseRequest = { // ConverseRequest
        modelId: modelId,
        messages: [
            {
                role: "user",
                content: [
                    {...member},
                    {
                        text: "I am providing you with an file of a timesheet for one or multiple employees. Based on the visual information available, please analyze the image and generate a JSON array of \"employees\" object containing the following attributes when available: \"name\", \"id\". In addition ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes when needed.If you don't find the information for \"employee_id\", you have to omit the field. Skip preambule and only give a valid full JSON in your response containing all employees. DO add anthing like : notes, comments, phrase, markdown like ```json ... ```."
                    }
                ]
            }
        ]
    };

    try {
        console.log("calling ConverseCommand : ", input)
        // Create a command object with the request information
        //const command = new InvokeModelCommand(params)
        const command = new ConverseCommand(input);

        // Use the client to send the command to Amazon Bedrock
        const response = await bedrockClient.send(command)

        // Parse the answer
        const outputMessage = response.output?.message
        //const response_body = JSON.parse(outputMessage)
        console.log("response.body : ", outputMessage)

        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body

        // Return the product information
        //const employeeInfo = JSON.parse(response_body.content[0].text)
        let employeeInfo = outputMessage?.content?.at(0)?.text || "";
        // Make sure we strip any phantom tag
        employeeInfo = employeeInfo.replace("```json", "")
        employeeInfo = employeeInfo.replace("```", "")
        console.log("employeeInfo : ", employeeInfo)
        return {
            statusCode: 200,
            employeeInfo
        }
    } catch (err: any) {
        console.error("Error invoking Bedrock:", err)
        return {
            statusCode: 500,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                message: "Failed to upload the file",
                error: err.message
            })
        }
    }
}


async function getEmployeeTimesheet(filename: string, buffer: Buffer, employee_name: string, employee_id: string) {
    try {


        // modelId: "anthropic.claude-3-haiku-20240307-v1:0",
        // modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
        // modelId: "anthropic.claude-3-5-sonnet-20240620-v1:00",
        // modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
        // prepare Claude 3 prompt
        let fullname = ""
        if (employee_name) {
            fullname = `"${employee_name}"`
        }
        if (employee_id) {
            fullname = `${fullname} (employee id is "${employee_id}")`
        }


        // Get file extension from mimetype or filename
        const fileFormat: any = filename.split('.')?.pop()?.toLowerCase() || "";

        const isImage = ['png', 'jpeg', 'jpg', 'gif', 'webp'].includes(fileFormat);
        const modelId = isImage ? process.env.MODEL_ID : 'us.amazon.nova-pro-v1:0'


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
                source:
                    {
                        bytes: buffer
                    }
            }
        }

        const input: ConverseRequest = {
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
        const command = new ConverseCommand(input);

        // Use the client to send the command to Amazon Bedrock
        const response = await bedrockClient.send(command)

        // Parse the answer
        //const textDecoder = new TextDecoder("utf-8")
        //console.log("response.body : ",textDecoder.decode(response.body))
        //const response_body = JSON.parse(textDecoder.decode(response.body))

        const outputMessage = response.output?.message
        let timesheetInfo = outputMessage?.content?.at(0)?.text || "";
        timesheetInfo = timesheetInfo.replace("```json", "")
        timesheetInfo = timesheetInfo.replace("```", "")

        console.log("response.body : ", timesheetInfo)

        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body

        return {
            statusCode: 200,
            timesheetInfo
        }
    } catch (err: any) {
        console.error("Error invoking Bedrock:", err)
        return {
            statusCode: 500,
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                message: "Failed to upload the file",
                error: err.message
            })
        }
    }
}

export {getEmployeeTimesheet, getEmployeeList}
