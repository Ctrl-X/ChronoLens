import { BedrockRuntimeClient, InvokeModelCommand } from "@aws-sdk/client-bedrock-runtime"

// Initialize the Bedrock client with your region
const bedrockClient = new BedrockRuntimeClient({ region: "us-west-2" })
const { ApplyGuardrailCommand } = require("@aws-sdk/client-bedrock")


async function describePicture(file: any) {
    // Convert file Buffer to a Base64 string
    const buffer = Buffer.from(file.content, "binary")
    const base64file = buffer.toString("base64")

    // modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    // modelId: "anthropic.claude-3-5-sonnet-20240620-v1:00",
    // modelId: "anthropic.claude-3-5-sonnet-20241022-v2:0",
    // prepare Claude 3 prompt
    const params = {
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
                            "text": "I am providing you with an file of a timesheet for employee. Based on the visual information available, please analyze the image and generate a JSON object containing the following attributes when available: \"employee_name\", \"employee_id\",  \"pay_period\" and an array of \"days\". You will find one or multiple days and time that you need to provide as a array of \"days\" containing : \"date\", \"start_time\", \"end_time\", \"lunch_time\", \"overtime\", \"total_hours\" for each work time of the employee. Ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes.If you don't find the information leave the attribute empty.Skip preambule and only give a valid JSON in your response. Here is the image:"
                        }
                    ]
                }
            ]
        })
    }


    try {
        // Create a command object with the request information
        const command = new InvokeModelCommand(params)

        // Use the client to send the command to Amazon Bedrock
        const response = await bedrockClient.send(command)

        // Parse the answer
        const textDecoder = new TextDecoder("utf-8")
        const response_body = JSON.parse(textDecoder.decode(response.body))

        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body

        // Return the product information
        const timesheetInfo = JSON.parse(response_body.content[0].text)
        return {
            statusCode: 200,
            timesheetInfo
        }
    } catch (err: any) {
        console.error("Error invoking Bedrock:", err)
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Failed to upload the file",
                error: err.message
            })
        }
    }
}

export default describePicture
