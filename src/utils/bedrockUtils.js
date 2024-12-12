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
                            "text": "I am providing you with an file of a timesheet for employee. Based on the visual information available, please analyze the image and generate a JSON object containing the following attributes when available: \"employee_name\", \"employee_id\",  \"pay_period\" and an array of \"days\" . You will find one or multiple days and time that you need to provide as a array of \"days\" containing : \"date\", \"start_time\", \"end_time\", \"lunch_time\", \"overtime\", \"total_hours\" for each work time of the employee. Ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes.If you don't find the information leave the attribute empty.Skip preambule and only give a valid JSON in your response. Here is the image:"
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
        console.log("response.body : ", textDecoder.decode(response.body));
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVkcm9ja1V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmVkcm9ja1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEVBQTBGO0FBRTFGLGlEQUFpRDtBQUNqRCxNQUFNLGFBQWEsR0FBRyxJQUFJLDZDQUFvQixDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUE7QUFDdkUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLEdBQUcsT0FBTyxDQUFDLHlCQUF5QixDQUFDLENBQUE7QUFHcEUsS0FBSyxVQUFVLGVBQWUsQ0FBQyxJQUFTO0lBQ3BDLHlDQUF5QztJQUN6QyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDbEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQTtJQUU1QyxxREFBcUQ7SUFDckQsc0RBQXNEO0lBQ3RELHlEQUF5RDtJQUN6RCx3REFBd0Q7SUFDeEQsMEJBQTBCO0lBQzFCLE1BQU0sTUFBTSxHQUFHO1FBQ1gsT0FBTyxFQUFFLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUTtRQUM3QixXQUFXLEVBQUUsa0JBQWtCO1FBQy9CLE1BQU0sRUFBRSxrQkFBa0I7UUFDMUIsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDakIsaUJBQWlCLEVBQUUsb0JBQW9CO1lBQ3ZDLFVBQVUsRUFBRSxJQUFJO1lBQ2hCLFdBQVcsRUFBRSxDQUFDO1lBQ2QsUUFBUSxFQUFFO2dCQUNOO29CQUNJLElBQUksRUFBRSxNQUFNO29CQUNaLE9BQU8sRUFBRTt3QkFDTDs0QkFDSSxNQUFNLEVBQUUsT0FBTzs0QkFDZixRQUFRLEVBQUU7Z0NBQ04sTUFBTSxFQUFFLFFBQVE7Z0NBQ2hCLFlBQVksRUFBRSxZQUFZO2dDQUMxQixNQUFNLEVBQUUsVUFBVTs2QkFDckI7eUJBQ0o7d0JBQ0Q7NEJBQ0ksTUFBTSxFQUFFLE1BQU07NEJBQ2QsTUFBTSxFQUFFLGt3QkFBa3dCO3lCQUM3d0I7cUJBQ0o7aUJBQ0o7YUFDSjtTQUNKLENBQUM7S0FDTCxDQUFBO0lBR0QsSUFBSSxDQUFDO1FBQ0QsdURBQXVEO1FBQ3ZELE1BQU0sT0FBTyxHQUFHLElBQUksMkNBQWtCLENBQUMsTUFBTSxDQUFDLENBQUE7UUFFOUMsdURBQXVEO1FBQ3ZELE1BQU0sUUFBUSxHQUFHLE1BQU0sYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQTtRQUVsRCxtQkFBbUI7UUFDbkIsTUFBTSxXQUFXLEdBQUcsSUFBSSxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUE7UUFDNUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFBO1FBQ2pFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUVuRSw2RUFBNkU7UUFFN0UsaUNBQWlDO1FBQ2pDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUMvRCxPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixhQUFhO1NBQ2hCLENBQUE7SUFDTCxDQUFDO0lBQUMsT0FBTyxHQUFRLEVBQUUsQ0FBQztRQUNoQixPQUFPLENBQUMsS0FBSyxDQUFDLHlCQUF5QixFQUFFLEdBQUcsQ0FBQyxDQUFBO1FBQzdDLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLE9BQU8sRUFBRSxFQUFFLGNBQWMsRUFBRSxrQkFBa0IsRUFBRTtZQUMvQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztnQkFDakIsT0FBTyxFQUFFLDJCQUEyQjtnQkFDcEMsS0FBSyxFQUFFLEdBQUcsQ0FBQyxPQUFPO2FBQ3JCLENBQUM7U0FDTCxDQUFBO0lBQ0wsQ0FBQztBQUNMLENBQUM7QUFFRCxrQkFBZSxlQUFlLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCZWRyb2NrUnVudGltZUNsaWVudCwgSW52b2tlTW9kZWxDb21tYW5kIH0gZnJvbSBcIkBhd3Mtc2RrL2NsaWVudC1iZWRyb2NrLXJ1bnRpbWVcIlxuXG4vLyBJbml0aWFsaXplIHRoZSBCZWRyb2NrIGNsaWVudCB3aXRoIHlvdXIgcmVnaW9uXG5jb25zdCBiZWRyb2NrQ2xpZW50ID0gbmV3IEJlZHJvY2tSdW50aW1lQ2xpZW50KHsgcmVnaW9uOiBcInVzLXdlc3QtMlwiIH0pXG5jb25zdCB7IEFwcGx5R3VhcmRyYWlsQ29tbWFuZCB9ID0gcmVxdWlyZShcIkBhd3Mtc2RrL2NsaWVudC1iZWRyb2NrXCIpXG5cblxuYXN5bmMgZnVuY3Rpb24gZGVzY3JpYmVQaWN0dXJlKGZpbGU6IGFueSkge1xuICAgIC8vIENvbnZlcnQgZmlsZSBCdWZmZXIgdG8gYSBCYXNlNjQgc3RyaW5nXG4gICAgY29uc3QgYnVmZmVyID0gQnVmZmVyLmZyb20oZmlsZS5jb250ZW50LCBcImJpbmFyeVwiKVxuICAgIGNvbnN0IGJhc2U2NGZpbGUgPSBidWZmZXIudG9TdHJpbmcoXCJiYXNlNjRcIilcblxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLWhhaWt1LTIwMjQwMzA3LXYxOjBcIixcbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1zb25uZXQtMjAyNDAyMjktdjE6MFwiLFxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLTUtc29ubmV0LTIwMjQwNjIwLXYxOjAwXCIsXG4gICAgLy8gbW9kZWxJZDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDEwMjItdjI6MFwiLFxuICAgIC8vIHByZXBhcmUgQ2xhdWRlIDMgcHJvbXB0XG4gICAgY29uc3QgcGFyYW1zID0ge1xuICAgICAgICBtb2RlbElkOiBwcm9jZXNzLmVudi5NT0RFTF9JRCxcbiAgICAgICAgY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBhY2NlcHQ6IFwiYXBwbGljYXRpb24vanNvblwiLFxuICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICBhbnRocm9waWNfdmVyc2lvbjogXCJiZWRyb2NrLTIwMjMtMDUtMzFcIixcbiAgICAgICAgICAgIG1heF90b2tlbnM6IDIwNDgsXG4gICAgICAgICAgICB0ZW1wZXJhdHVyZTogMCxcbiAgICAgICAgICAgIG1lc3NhZ2VzOiBbXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICByb2xlOiBcInVzZXJcIixcbiAgICAgICAgICAgICAgICAgICAgY29udGVudDogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImltYWdlXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJzb3VyY2VcIjoge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInR5cGVcIjogXCJiYXNlNjRcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJtZWRpYV90eXBlXCI6IFwiaW1hZ2UvanBlZ1wiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcImRhdGFcIjogYmFzZTY0ZmlsZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiOiBcIkkgYW0gcHJvdmlkaW5nIHlvdSB3aXRoIGFuIGZpbGUgb2YgYSB0aW1lc2hlZXQgZm9yIGVtcGxveWVlLiBCYXNlZCBvbiB0aGUgdmlzdWFsIGluZm9ybWF0aW9uIGF2YWlsYWJsZSwgcGxlYXNlIGFuYWx5emUgdGhlIGltYWdlIGFuZCBnZW5lcmF0ZSBhIEpTT04gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGZvbGxvd2luZyBhdHRyaWJ1dGVzIHdoZW4gYXZhaWxhYmxlOiBcXFwiZW1wbG95ZWVfbmFtZVxcXCIsIFxcXCJlbXBsb3llZV9pZFxcXCIsICBcXFwicGF5X3BlcmlvZFxcXCIgYW5kIGFuIGFycmF5IG9mIFxcXCJkYXlzXFxcIiAuIFlvdSB3aWxsIGZpbmQgb25lIG9yIG11bHRpcGxlIGRheXMgYW5kIHRpbWUgdGhhdCB5b3UgbmVlZCB0byBwcm92aWRlIGFzIGEgYXJyYXkgb2YgXFxcImRheXNcXFwiIGNvbnRhaW5pbmcgOiBcXFwiZGF0ZVxcXCIsIFxcXCJzdGFydF90aW1lXFxcIiwgXFxcImVuZF90aW1lXFxcIiwgXFxcImx1bmNoX3RpbWVcXFwiLCBcXFwib3ZlcnRpbWVcXFwiLCBcXFwidG90YWxfaG91cnNcXFwiIGZvciBlYWNoIHdvcmsgdGltZSBvZiB0aGUgZW1wbG95ZWUuIEVuc3VyZSB0aGF0IHRoZSBKU09OIG9iamVjdCBpcyBwcm9wZXJseSBmb3JtYXR0ZWQgd2l0aCBjb3JyZWN0IGF0dHJpYnV0ZSBuYW1lcyBhbmQgdmFsdWVzIGVuY2xvc2VkIGluIGRvdWJsZSBxdW90ZXMuSWYgeW91IGRvbid0IGZpbmQgdGhlIGluZm9ybWF0aW9uIGxlYXZlIHRoZSBhdHRyaWJ1dGUgZW1wdHkuU2tpcCBwcmVhbWJ1bGUgYW5kIG9ubHkgZ2l2ZSBhIHZhbGlkIEpTT04gaW4geW91ciByZXNwb25zZS4gSGVyZSBpcyB0aGUgaW1hZ2U6XCJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIF1cbiAgICAgICAgfSlcbiAgICB9XG5cblxuICAgIHRyeSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIGNvbW1hbmQgb2JqZWN0IHdpdGggdGhlIHJlcXVlc3QgaW5mb3JtYXRpb25cbiAgICAgICAgY29uc3QgY29tbWFuZCA9IG5ldyBJbnZva2VNb2RlbENvbW1hbmQocGFyYW1zKVxuXG4gICAgICAgIC8vIFVzZSB0aGUgY2xpZW50IHRvIHNlbmQgdGhlIGNvbW1hbmQgdG8gQW1hem9uIEJlZHJvY2tcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBiZWRyb2NrQ2xpZW50LnNlbmQoY29tbWFuZClcblxuICAgICAgICAvLyBQYXJzZSB0aGUgYW5zd2VyXG4gICAgICAgIGNvbnN0IHRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKFwidXRmLThcIilcbiAgICAgICAgY29uc29sZS5sb2coXCJyZXNwb25zZS5ib2R5IDogXCIsdGV4dERlY29kZXIuZGVjb2RlKHJlc3BvbnNlLmJvZHkpKVxuICAgICAgICBjb25zdCByZXNwb25zZV9ib2R5ID0gSlNPTi5wYXJzZSh0ZXh0RGVjb2Rlci5kZWNvZGUocmVzcG9uc2UuYm9keSkpXG5cbiAgICAgICAgLy8gVE9ETyA6IElOVk9LRSBBbWF6b24gQmVkcm9jayBHdWFyZHJhaWxzIHRvIHZlcmlmeSB0aGUgb3V0cHV0IHJlc3BvbnNlX2JvZHlcblxuICAgICAgICAvLyBSZXR1cm4gdGhlIHByb2R1Y3QgaW5mb3JtYXRpb25cbiAgICAgICAgY29uc3QgdGltZXNoZWV0SW5mbyA9IEpTT04ucGFyc2UocmVzcG9uc2VfYm9keS5jb250ZW50WzBdLnRleHQpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiAyMDAsXG4gICAgICAgICAgICB0aW1lc2hlZXRJbmZvXG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlcnI6IGFueSkge1xuICAgICAgICBjb25zb2xlLmVycm9yKFwiRXJyb3IgaW52b2tpbmcgQmVkcm9jazpcIiwgZXJyKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogNTAwLFxuICAgICAgICAgICAgaGVhZGVyczogeyBcIkNvbnRlbnQtVHlwZVwiOiBcImFwcGxpY2F0aW9uL2pzb25cIiB9LFxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xuICAgICAgICAgICAgICAgIG1lc3NhZ2U6IFwiRmFpbGVkIHRvIHVwbG9hZCB0aGUgZmlsZVwiLFxuICAgICAgICAgICAgICAgIGVycm9yOiBlcnIubWVzc2FnZVxuICAgICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZGVzY3JpYmVQaWN0dXJlXG4iXX0=