"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
// Initialize the Bedrock client with your region
const bedrockClient = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: "us-west-2" });
const { ApplyGuardrailCommand } = require("@aws-sdk/client-bedrock");
async function describePicture(file) {
    // Convert file Buffer to a Base64 string
    const buffer = Buffer.from(file.content, "binary");
    const base64file = buffer.toString("base64");
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
    };
    try {
        // Create a command object with the request information
        const command = new client_bedrock_runtime_1.InvokeModelCommand(params);
        // Use the client to send the command to Amazon Bedrock
        const response = await bedrockClient.send(command);
        // Parse the answer
        const textDecoder = new TextDecoder("utf-8");
        const response_body = JSON.parse(textDecoder.decode(response.body));
        // TODO : INVOKE Amazon Bedrock Guardrails to verify the output response_body
        // Return the product information
        const timesheetInfo = JSON.parse(response_body.content[0].text);
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
exports.default = describePicture;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVkcm9ja1V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmVkcm9ja1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEVBQTBGO0FBRTFGLGlEQUFpRDtBQUNqRCxNQUFNLGFBQWEsR0FBRyxJQUFJLDZDQUFvQixDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUE7QUFDdkUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFHcEUsS0FBSyxVQUFVLGVBQWUsQ0FBQyxJQUFTO0lBQ3BDLHlDQUF5QztJQUN6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDbEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUU1QyxxREFBcUQ7SUFDckQsc0RBQXNEO0lBQ3RELHlEQUF5RDtJQUN6RCx3REFBd0Q7SUFDeEQsMEJBQTBCO0lBQzFCLE1BQU0sTUFBTSxHQUFHO1FBQ1gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtRQUM3QixXQUFXLEVBQUUsa0JBQWtCO1FBQy9CLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDakIsaUJBQWlCLEVBQUUsb0JBQW9CO1lBQ3ZDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxDQUFDO1lBQ2QsUUFBUSxFQUFFO2dCQUNOO29CQUNJLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRTt3QkFDTDs0QkFDSSxNQUFNLEVBQUUsT0FBTzs0QkFDZixRQUFRLEVBQUU7Z0NBQ04sTUFBTSxFQUFFLFFBQVE7Z0NBQ2hCLFlBQVksRUFBRSxZQUFZO2dDQUMxQixNQUFNLEVBQUUsVUFBVTs2QkFDckI7eUJBQ0o7d0JBQ0Q7NEJBQ0ksTUFBTSxFQUFFLE1BQU07NEJBQ2QsTUFBTSxFQUFFLGl3QkFBaXdCO3lCQUM1d0I7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKLENBQUM7S0FDTCxDQUFBO0lBR0QsSUFBSSxDQUFDO1FBQ0QsdURBQXVEO1FBQ3ZELE1BQU0sT0FBTyxHQUFHLElBQUksMkNBQWtCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFOUMsdURBQXVEO1FBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVsRCxtQkFBbUI7UUFDbkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDNUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBRW5FLDZFQUE2RTtRQUU3RSxpQ0FBaUM7UUFDakMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQy9ELE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLGFBQWE7U0FDaEIsQ0FBQTtJQUNMLENBQUM7SUFBQyxPQUFPLEdBQVEsRUFBRSxDQUFDO1FBQ2hCLE9BQU8sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDN0MsT0FBTztZQUNILFVBQVUsRUFBRSxHQUFHO1lBQ2YsT0FBTyxFQUFFLEVBQUUsY0FBYyxFQUFFLGtCQUFrQixFQUFFO1lBQy9DLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQixPQUFPLEVBQUUsMkJBQTJCO2dCQUNwQyxLQUFLLEVBQUUsR0FBRyxDQUFDLE9BQU87YUFDckIsQ0FBQztTQUNMLENBQUE7SUFDTCxDQUFDO0FBQ0wsQ0FBQztBQUVELGtCQUFlLGVBQWUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJlZHJvY2tSdW50aW1lQ2xpZW50LCBJbnZva2VNb2RlbENvbW1hbmQgfSBmcm9tIFwiQGF3cy1zZGsvY2xpZW50LWJlZHJvY2stcnVudGltZVwiXG5cbi8vIEluaXRpYWxpemUgdGhlIEJlZHJvY2sgY2xpZW50IHdpdGggeW91ciByZWdpb25cbmNvbnN0IGJlZHJvY2tDbGllbnQgPSBuZXcgQmVkcm9ja1J1bnRpbWVDbGllbnQoeyByZWdpb246IFwidXMtd2VzdC0yXCIgfSlcbmNvbnN0IHsgQXBwbHlHdWFyZHJhaWxDb21tYW5kIH0gPSByZXF1aXJlKFwiQGF3cy1zZGsvY2xpZW50LWJlZHJvY2tcIilcblxuXG5hc3luYyBmdW5jdGlvbiBkZXNjcmliZVBpY3R1cmUoZmlsZTogYW55KSB7XG4gICAgLy8gQ29udmVydCBmaWxlIEJ1ZmZlciB0byBhIEJhc2U2NCBzdHJpbmdcbiAgICBjb25zdCBidWZmZXIgPSBCdWZmZXIuZnJvbShmaWxlLmNvbnRlbnQsIFwiYmluYXJ5XCIpXG4gICAgY29uc3QgYmFzZTY0ZmlsZSA9IGJ1ZmZlci50b1N0cmluZyhcImJhc2U2NFwiKVxuXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtaGFpa3UtMjAyNDAzMDctdjE6MFwiLFxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLXNvbm5ldC0yMDI0MDIyOS12MTowXCIsXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDA2MjAtdjE6MDBcIixcbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy01LXNvbm5ldC0yMDI0MTAyMi12MjowXCIsXG4gICAgLy8gcHJlcGFyZSBDbGF1ZGUgMyBwcm9tcHRcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIG1vZGVsSWQ6IHByb2Nlc3MuZW52Lk1PREVMX0lELFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGFudGhyb3BpY192ZXJzaW9uOiBcImJlZHJvY2stMjAyMy0wNS0zMVwiLFxuICAgICAgICAgICAgbWF4X3Rva2VuczogMjA0OCxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJhc2U2NFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lZGlhX3R5cGVcIjogXCJpbWFnZS9qcGVnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBiYXNlNjRmaWxlXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJ0ZXh0XCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0ZXh0XCI6IFwiSSBhbSBwcm92aWRpbmcgeW91IHdpdGggYW4gZmlsZSBvZiBhIHRpbWVzaGVldCBmb3IgZW1wbG95ZWUuIEJhc2VkIG9uIHRoZSB2aXN1YWwgaW5mb3JtYXRpb24gYXZhaWxhYmxlLCBwbGVhc2UgYW5hbHl6ZSB0aGUgaW1hZ2UgYW5kIGdlbmVyYXRlIGEgSlNPTiBvYmplY3QgY29udGFpbmluZyB0aGUgZm9sbG93aW5nIGF0dHJpYnV0ZXMgd2hlbiBhdmFpbGFibGU6IFxcXCJlbXBsb3llZV9uYW1lXFxcIiwgXFxcImVtcGxveWVlX2lkXFxcIiwgIFxcXCJwYXlfcGVyaW9kXFxcIiBhbmQgYW4gYXJyYXkgb2YgXFxcImRheXNcXFwiLiBZb3Ugd2lsbCBmaW5kIG9uZSBvciBtdWx0aXBsZSBkYXlzIGFuZCB0aW1lIHRoYXQgeW91IG5lZWQgdG8gcHJvdmlkZSBhcyBhIGFycmF5IG9mIFxcXCJkYXlzXFxcIiBjb250YWluaW5nIDogXFxcImRhdGVcXFwiLCBcXFwic3RhcnRfdGltZVxcXCIsIFxcXCJlbmRfdGltZVxcXCIsIFxcXCJsdW5jaF90aW1lXFxcIiwgXFxcIm92ZXJ0aW1lXFxcIiwgXFxcInRvdGFsX2hvdXJzXFxcIiBmb3IgZWFjaCB3b3JrIHRpbWUgb2YgdGhlIGVtcGxveWVlLiBFbnN1cmUgdGhhdCB0aGUgSlNPTiBvYmplY3QgaXMgcHJvcGVybHkgZm9ybWF0dGVkIHdpdGggY29ycmVjdCBhdHRyaWJ1dGUgbmFtZXMgYW5kIHZhbHVlcyBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGVzLklmIHlvdSBkb24ndCBmaW5kIHRoZSBpbmZvcm1hdGlvbiBsZWF2ZSB0aGUgYXR0cmlidXRlIGVtcHR5LlNraXAgcHJlYW1idWxlIGFuZCBvbmx5IGdpdmUgYSB2YWxpZCBKU09OIGluIHlvdXIgcmVzcG9uc2UuIEhlcmUgaXMgdGhlIGltYWdlOlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICB0cnkge1xuICAgICAgICAvLyBDcmVhdGUgYSBjb21tYW5kIG9iamVjdCB3aXRoIHRoZSByZXF1ZXN0IGluZm9ybWF0aW9uXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgSW52b2tlTW9kZWxDb21tYW5kKHBhcmFtcylcblxuICAgICAgICAvLyBVc2UgdGhlIGNsaWVudCB0byBzZW5kIHRoZSBjb21tYW5kIHRvIEFtYXpvbiBCZWRyb2NrXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYmVkcm9ja0NsaWVudC5zZW5kKGNvbW1hbmQpXG5cbiAgICAgICAgLy8gUGFyc2UgdGhlIGFuc3dlclxuICAgICAgICBjb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlX2JvZHkgPSBKU09OLnBhcnNlKHRleHREZWNvZGVyLmRlY29kZShyZXNwb25zZS5ib2R5KSlcblxuICAgICAgICAvLyBUT0RPIDogSU5WT0tFIEFtYXpvbiBCZWRyb2NrIEd1YXJkcmFpbHMgdG8gdmVyaWZ5IHRoZSBvdXRwdXQgcmVzcG9uc2VfYm9keVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJvZHVjdCBpbmZvcm1hdGlvblxuICAgICAgICBjb25zdCB0aW1lc2hlZXRJbmZvID0gSlNPTi5wYXJzZShyZXNwb25zZV9ib2R5LmNvbnRlbnRbMF0udGV4dClcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcbiAgICAgICAgICAgIHRpbWVzaGVldEluZm9cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbnZva2luZyBCZWRyb2NrOlwiLCBlcnIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gdXBsb2FkIHRoZSBmaWxlXCIsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlXG4gICAgICAgICAgICB9KVxuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBkZXNjcmliZVBpY3R1cmVcbiJdfQ==