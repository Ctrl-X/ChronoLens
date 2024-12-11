"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
// Initialize the Bedrock client with your region
const bedrockClient = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: "us-west-2" });
const { ApplyGuardrailCommand } = require("@aws-sdk/client-bedrock");
async function describePicture(image) {
    // Convert image Buffer to a Base64 string
    const buffer = Buffer.from(image.content, "binary");
    const base64Image = buffer.toString("base64");
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
                                "data": base64Image
                            }
                        },
                        {
                            "type": "text",
                            "text": "I am providing you with an image of a timesheet for employee. Based on the visual information available, please analyze the image and generate a JSON object containing the following attributes when available: \"employee_name\", \"employee_id\", \"date_range\", \"pay_period\", \"start_time\", \"end_time\", \"lunch_time\", \"overtime\", \"total_hours\". If you find multiple days and time, provide an array containing all informations about the work time of the employee. Ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes.If you don't find the information leave the attribute empty.Skip preambule and only give a valid JSON in your response. Here is the image:"
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
        const productInfo = JSON.parse(response_body.content[0].text);
        return {
            statusCode: 200,
            productInfo
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVkcm9ja1V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmVkcm9ja1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEVBQTBGO0FBRTFGLGlEQUFpRDtBQUNqRCxNQUFNLGFBQWEsR0FBRyxJQUFJLDZDQUFvQixDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUE7QUFDdkUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFHcEUsS0FBSyxVQUFVLGVBQWUsQ0FBQyxLQUFVO0lBQ3JDLDBDQUEwQztJQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDbkQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUU3QyxxREFBcUQ7SUFDckQsc0RBQXNEO0lBQ3RELHlEQUF5RDtJQUN6RCx3REFBd0Q7SUFDeEQsMEJBQTBCO0lBQzFCLE1BQU0sTUFBTSxHQUFHO1FBQ1gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtRQUM3QixXQUFXLEVBQUUsa0JBQWtCO1FBQy9CLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDakIsaUJBQWlCLEVBQUUsb0JBQW9CO1lBQ3ZDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxDQUFDO1lBQ2QsUUFBUSxFQUFFO2dCQUNOO29CQUNJLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRTt3QkFDTDs0QkFDSSxNQUFNLEVBQUUsT0FBTzs0QkFDZixRQUFRLEVBQUU7Z0NBQ04sTUFBTSxFQUFFLFFBQVE7Z0NBQ2hCLFlBQVksRUFBRSxZQUFZO2dDQUMxQixNQUFNLEVBQUUsV0FBVzs2QkFDdEI7eUJBQ0o7d0JBQ0Q7NEJBQ0ksTUFBTSxFQUFFLE1BQU07NEJBQ2QsTUFBTSxFQUFFLHd0QkFBd3RCO3lCQUNudUI7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKLENBQUM7S0FDTCxDQUFBO0lBR0QsSUFBSSxDQUFDO1FBQ0QsdURBQXVEO1FBQ3ZELE1BQU0sT0FBTyxHQUFHLElBQUksMkNBQWtCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFOUMsdURBQXVEO1FBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVsRCxtQkFBbUI7UUFDbkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDNUMsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBRW5FLDZFQUE2RTtRQUU3RSxpQ0FBaUM7UUFDakMsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzdELE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLFdBQVc7U0FDZCxDQUFBO0lBQ0wsQ0FBQztJQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUM3QyxPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7WUFDL0MsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pCLE9BQU8sRUFBRSwyQkFBMkI7Z0JBQ3BDLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTzthQUNyQixDQUFDO1NBQ0wsQ0FBQTtJQUNMLENBQUM7QUFDTCxDQUFDO0FBRUQsa0JBQWUsZUFBZSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmVkcm9ja1J1bnRpbWVDbGllbnQsIEludm9rZU1vZGVsQ29tbWFuZCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtYmVkcm9jay1ydW50aW1lXCJcblxuLy8gSW5pdGlhbGl6ZSB0aGUgQmVkcm9jayBjbGllbnQgd2l0aCB5b3VyIHJlZ2lvblxuY29uc3QgYmVkcm9ja0NsaWVudCA9IG5ldyBCZWRyb2NrUnVudGltZUNsaWVudCh7IHJlZ2lvbjogXCJ1cy13ZXN0LTJcIiB9KVxuY29uc3QgeyBBcHBseUd1YXJkcmFpbENvbW1hbmQgfSA9IHJlcXVpcmUoXCJAYXdzLXNkay9jbGllbnQtYmVkcm9ja1wiKVxuXG5cbmFzeW5jIGZ1bmN0aW9uIGRlc2NyaWJlUGljdHVyZShpbWFnZTogYW55KSB7XG4gICAgLy8gQ29udmVydCBpbWFnZSBCdWZmZXIgdG8gYSBCYXNlNjQgc3RyaW5nXG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oaW1hZ2UuY29udGVudCwgXCJiaW5hcnlcIilcbiAgICBjb25zdCBiYXNlNjRJbWFnZSA9IGJ1ZmZlci50b1N0cmluZyhcImJhc2U2NFwiKVxuXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtaGFpa3UtMjAyNDAzMDctdjE6MFwiLFxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLXNvbm5ldC0yMDI0MDIyOS12MTowXCIsXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDA2MjAtdjE6MDBcIixcbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy01LXNvbm5ldC0yMDI0MTAyMi12MjowXCIsXG4gICAgLy8gcHJlcGFyZSBDbGF1ZGUgMyBwcm9tcHRcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIG1vZGVsSWQ6IHByb2Nlc3MuZW52Lk1PREVMX0lELFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGFudGhyb3BpY192ZXJzaW9uOiBcImJlZHJvY2stMjAyMy0wNS0zMVwiLFxuICAgICAgICAgICAgbWF4X3Rva2VuczogMjA0OCxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJhc2U2NFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lZGlhX3R5cGVcIjogXCJpbWFnZS9qcGVnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBiYXNlNjRJbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkkgYW0gcHJvdmlkaW5nIHlvdSB3aXRoIGFuIGltYWdlIG9mIGEgdGltZXNoZWV0IGZvciBlbXBsb3llZS4gQmFzZWQgb24gdGhlIHZpc3VhbCBpbmZvcm1hdGlvbiBhdmFpbGFibGUsIHBsZWFzZSBhbmFseXplIHRoZSBpbWFnZSBhbmQgZ2VuZXJhdGUgYSBKU09OIG9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlcyB3aGVuIGF2YWlsYWJsZTogXFxcImVtcGxveWVlX25hbWVcXFwiLCBcXFwiZW1wbG95ZWVfaWRcXFwiLCBcXFwiZGF0ZV9yYW5nZVxcXCIsIFxcXCJwYXlfcGVyaW9kXFxcIiwgXFxcInN0YXJ0X3RpbWVcXFwiLCBcXFwiZW5kX3RpbWVcXFwiLCBcXFwibHVuY2hfdGltZVxcXCIsIFxcXCJvdmVydGltZVxcXCIsIFxcXCJ0b3RhbF9ob3Vyc1xcXCIuIElmIHlvdSBmaW5kIG11bHRpcGxlIGRheXMgYW5kIHRpbWUsIHByb3ZpZGUgYW4gYXJyYXkgY29udGFpbmluZyBhbGwgaW5mb3JtYXRpb25zIGFib3V0IHRoZSB3b3JrIHRpbWUgb2YgdGhlIGVtcGxveWVlLiBFbnN1cmUgdGhhdCB0aGUgSlNPTiBvYmplY3QgaXMgcHJvcGVybHkgZm9ybWF0dGVkIHdpdGggY29ycmVjdCBhdHRyaWJ1dGUgbmFtZXMgYW5kIHZhbHVlcyBlbmNsb3NlZCBpbiBkb3VibGUgcXVvdGVzLklmIHlvdSBkb24ndCBmaW5kIHRoZSBpbmZvcm1hdGlvbiBsZWF2ZSB0aGUgYXR0cmlidXRlIGVtcHR5LlNraXAgcHJlYW1idWxlIGFuZCBvbmx5IGdpdmUgYSB2YWxpZCBKU09OIGluIHlvdXIgcmVzcG9uc2UuIEhlcmUgaXMgdGhlIGltYWdlOlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICBdXG4gICAgICAgIH0pXG4gICAgfVxuXG5cbiAgICB0cnkge1xuICAgICAgICAvLyBDcmVhdGUgYSBjb21tYW5kIG9iamVjdCB3aXRoIHRoZSByZXF1ZXN0IGluZm9ybWF0aW9uXG4gICAgICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgSW52b2tlTW9kZWxDb21tYW5kKHBhcmFtcylcblxuICAgICAgICAvLyBVc2UgdGhlIGNsaWVudCB0byBzZW5kIHRoZSBjb21tYW5kIHRvIEFtYXpvbiBCZWRyb2NrXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgYmVkcm9ja0NsaWVudC5zZW5kKGNvbW1hbmQpXG5cbiAgICAgICAgLy8gUGFyc2UgdGhlIGFuc3dlclxuICAgICAgICBjb25zdCB0ZXh0RGVjb2RlciA9IG5ldyBUZXh0RGVjb2RlcihcInV0Zi04XCIpXG4gICAgICAgIGNvbnN0IHJlc3BvbnNlX2JvZHkgPSBKU09OLnBhcnNlKHRleHREZWNvZGVyLmRlY29kZShyZXNwb25zZS5ib2R5KSlcblxuICAgICAgICAvLyBUT0RPIDogSU5WT0tFIEFtYXpvbiBCZWRyb2NrIEd1YXJkcmFpbHMgdG8gdmVyaWZ5IHRoZSBvdXRwdXQgcmVzcG9uc2VfYm9keVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJvZHVjdCBpbmZvcm1hdGlvblxuICAgICAgICBjb25zdCBwcm9kdWN0SW5mbyA9IEpTT04ucGFyc2UocmVzcG9uc2VfYm9keS5jb250ZW50WzBdLnRleHQpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgICAgICBwcm9kdWN0SW5mb1xuICAgICAgICB9XG4gICAgfSBjYXRjaCAoZXJyOiBhbnkpIHtcbiAgICAgICAgY29uc29sZS5lcnJvcihcIkVycm9yIGludm9raW5nIEJlZHJvY2s6XCIsIGVycilcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcbiAgICAgICAgICAgIGhlYWRlcnM6IHsgXCJDb250ZW50LVR5cGVcIjogXCJhcHBsaWNhdGlvbi9qc29uXCIgfSxcbiAgICAgICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgICAgICBtZXNzYWdlOiBcIkZhaWxlZCB0byB1cGxvYWQgdGhlIGZpbGVcIixcbiAgICAgICAgICAgICAgICBlcnJvcjogZXJyLm1lc3NhZ2VcbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlc2NyaWJlUGljdHVyZVxuIl19