"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_bedrock_runtime_1 = require("@aws-sdk/client-bedrock-runtime");
// Initialize the Bedrock client with your region
const bedrockClient = new client_bedrock_runtime_1.BedrockRuntimeClient({ region: "us-west-2" });
async function describePicture(image) {
    // Convert image Buffer to a Base64 string
    const buffer = Buffer.from(image.content, "binary");
    const base64Image = buffer.toString('base64');
    // modelId: "anthropic.claude-3-haiku-20240307-v1:0",
    // modelId: "anthropic.claude-3-sonnet-20240229-v1:0",
    // modelId: "anthropic.claude-3-5-sonnet-20240620-v1:00",
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
                            "text": "Claude 3 Sonnet, I am providing you with an image of a product. Based on the visual information available, please analyze the image and generate a JSON object containing the following attributes: \"product_name\", \"product_brand\", \"description\", \"format_size\", and \"category\". The \"description\" should be a concise phrase of no more than 20 words that captures the essence of the product. The \"format_size\" should specify the quantity in units such as grams, milliliters, or kilograms. The \"category\" should be a general classification of the product such as food, furniture, well-being, outfit, beverage,fresh food,etc. Ensure that the JSON object is properly formatted with correct attribute names and values enclosed in double quotes.If you don't find the information leave the attribute empty.Skip preambule and only give a valid JSON in your response.Only take english words from the picture. Here is the image:"
                        }
                    ]
                },
            ],
        }),
    };
    // Create the command object
    const command = new client_bedrock_runtime_1.InvokeModelCommand(params);
    try {
        // Use the client to send the command
        const response = await bedrockClient.send(command);
        const textDecoder = new TextDecoder("utf-8");
        const response_body = JSON.parse(textDecoder.decode(response.body));
        const productInfo = JSON.parse(response_body.content[0].text);
        console.log("response_body : ", response_body);
        console.log("productInfo : ", productInfo);
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
                error: err.message,
            }),
        };
    }
}
exports.default = describePicture;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmVkcm9ja1V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYmVkcm9ja1V0aWxzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsNEVBQTBGO0FBRTFGLGlEQUFpRDtBQUNqRCxNQUFNLGFBQWEsR0FBRyxJQUFJLDZDQUFvQixDQUFDLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDLENBQUE7QUFFdkUsS0FBSyxVQUFVLGVBQWUsQ0FBQyxLQUFVO0lBQ3JDLDBDQUEwQztJQUMxQyxNQUFNLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLENBQUE7SUFDbEQsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsQ0FBQztJQUUvQyxxREFBcUQ7SUFDckQsc0RBQXNEO0lBQ3RELHlEQUF5RDtJQUN6RCwwQkFBMEI7SUFDMUIsTUFBTSxNQUFNLEdBQUc7UUFDWCxPQUFPLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRO1FBQzdCLFdBQVcsRUFBRSxrQkFBa0I7UUFDL0IsTUFBTSxFQUFFLGtCQUFrQjtRQUMxQixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQztZQUNqQixpQkFBaUIsRUFBRSxvQkFBb0I7WUFDdkMsVUFBVSxFQUFFLElBQUk7WUFDaEIsV0FBVyxFQUFFLENBQUM7WUFDZCxRQUFRLEVBQUU7Z0JBQ047b0JBQ0ksSUFBSSxFQUFFLE1BQU07b0JBQ1osT0FBTyxFQUFFO3dCQUNMOzRCQUNJLE1BQU0sRUFBRSxPQUFPOzRCQUNmLFFBQVEsRUFBRTtnQ0FDTixNQUFNLEVBQUUsUUFBUTtnQ0FDaEIsWUFBWSxFQUFFLFlBQVk7Z0NBQzFCLE1BQU0sRUFBRSxXQUFXOzZCQUN0Qjt5QkFDSjt3QkFDRDs0QkFDSSxNQUFNLEVBQUUsTUFBTTs0QkFDZCxNQUFNLEVBQUcsbzZCQUFvNkI7eUJBQ2g3QjtxQkFDSjtpQkFDSjthQUNKO1NBQ0osQ0FBQztLQUNMLENBQUE7SUFFRCw0QkFBNEI7SUFDNUIsTUFBTSxPQUFPLEdBQUcsSUFBSSwyQ0FBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUU5QyxJQUFJLENBQUM7UUFDRCxxQ0FBcUM7UUFDckMsTUFBTSxRQUFRLEdBQUcsTUFBTSxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQ2xELE1BQU0sV0FBVyxHQUFHLElBQUksV0FBVyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBQzVDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQTtRQUNuRSxNQUFNLFdBQVcsR0FBSSxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUE7UUFFOUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxrQkFBa0IsRUFBQyxhQUFhLENBQUMsQ0FBQTtRQUM3QyxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQ3pDLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLFdBQVc7U0FDZCxDQUFBO0lBQ0wsQ0FBQztJQUFDLE9BQU8sR0FBUSxFQUFFLENBQUM7UUFDaEIsT0FBTyxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUM3QyxPQUFPO1lBQ0gsVUFBVSxFQUFFLEdBQUc7WUFDZixPQUFPLEVBQUUsRUFBRSxjQUFjLEVBQUUsa0JBQWtCLEVBQUU7WUFDL0MsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQ2pCLE9BQU8sRUFBRSwyQkFBMkI7Z0JBQ3BDLEtBQUssRUFBRSxHQUFHLENBQUMsT0FBTzthQUNyQixDQUFDO1NBQ0wsQ0FBQTtJQUNMLENBQUM7QUFDTCxDQUFDO0FBRUQsa0JBQWUsZUFBZSxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmVkcm9ja1J1bnRpbWVDbGllbnQsIEludm9rZU1vZGVsQ29tbWFuZCB9IGZyb20gXCJAYXdzLXNkay9jbGllbnQtYmVkcm9jay1ydW50aW1lXCJcblxuLy8gSW5pdGlhbGl6ZSB0aGUgQmVkcm9jayBjbGllbnQgd2l0aCB5b3VyIHJlZ2lvblxuY29uc3QgYmVkcm9ja0NsaWVudCA9IG5ldyBCZWRyb2NrUnVudGltZUNsaWVudCh7IHJlZ2lvbjogXCJ1cy13ZXN0LTJcIiB9KVxuXG5hc3luYyBmdW5jdGlvbiBkZXNjcmliZVBpY3R1cmUoaW1hZ2U6IGFueSkge1xuICAgIC8vIENvbnZlcnQgaW1hZ2UgQnVmZmVyIHRvIGEgQmFzZTY0IHN0cmluZ1xuICAgIGNvbnN0IGJ1ZmZlciA9IEJ1ZmZlci5mcm9tKGltYWdlLmNvbnRlbnQsIFwiYmluYXJ5XCIpXG4gICAgIGNvbnN0IGJhc2U2NEltYWdlID0gYnVmZmVyLnRvU3RyaW5nKCdiYXNlNjQnKTtcblxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLWhhaWt1LTIwMjQwMzA3LXYxOjBcIixcbiAgICAvLyBtb2RlbElkOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1zb25uZXQtMjAyNDAyMjktdjE6MFwiLFxuICAgIC8vIG1vZGVsSWQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLTUtc29ubmV0LTIwMjQwNjIwLXYxOjAwXCIsXG4gICAgLy8gcHJlcGFyZSBDbGF1ZGUgMyBwcm9tcHRcbiAgICBjb25zdCBwYXJhbXMgPSB7XG4gICAgICAgIG1vZGVsSWQ6IHByb2Nlc3MuZW52Lk1PREVMX0lELFxuICAgICAgICBjb250ZW50VHlwZTogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGFjY2VwdDogXCJhcHBsaWNhdGlvbi9qc29uXCIsXG4gICAgICAgIGJvZHk6IEpTT04uc3RyaW5naWZ5KHtcbiAgICAgICAgICAgIGFudGhyb3BpY192ZXJzaW9uOiBcImJlZHJvY2stMjAyMy0wNS0zMVwiLFxuICAgICAgICAgICAgbWF4X3Rva2VuczogMjA0OCxcbiAgICAgICAgICAgIHRlbXBlcmF0dXJlOiAwLFxuICAgICAgICAgICAgbWVzc2FnZXM6IFtcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHJvbGU6IFwidXNlclwiLFxuICAgICAgICAgICAgICAgICAgICBjb250ZW50OiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwiaW1hZ2VcIixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBcInNvdXJjZVwiOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidHlwZVwiOiBcImJhc2U2NFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBcIm1lZGlhX3R5cGVcIjogXCJpbWFnZS9qcGVnXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwiZGF0YVwiOiBiYXNlNjRJbWFnZVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXCJ0eXBlXCI6IFwidGV4dFwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFwidGV4dFwiIDogXCJDbGF1ZGUgMyBTb25uZXQsIEkgYW0gcHJvdmlkaW5nIHlvdSB3aXRoIGFuIGltYWdlIG9mIGEgcHJvZHVjdC4gQmFzZWQgb24gdGhlIHZpc3VhbCBpbmZvcm1hdGlvbiBhdmFpbGFibGUsIHBsZWFzZSBhbmFseXplIHRoZSBpbWFnZSBhbmQgZ2VuZXJhdGUgYSBKU09OIG9iamVjdCBjb250YWluaW5nIHRoZSBmb2xsb3dpbmcgYXR0cmlidXRlczogXFxcInByb2R1Y3RfbmFtZVxcXCIsIFxcXCJwcm9kdWN0X2JyYW5kXFxcIiwgXFxcImRlc2NyaXB0aW9uXFxcIiwgXFxcImZvcm1hdF9zaXplXFxcIiwgYW5kIFxcXCJjYXRlZ29yeVxcXCIuIFRoZSBcXFwiZGVzY3JpcHRpb25cXFwiIHNob3VsZCBiZSBhIGNvbmNpc2UgcGhyYXNlIG9mIG5vIG1vcmUgdGhhbiAyMCB3b3JkcyB0aGF0IGNhcHR1cmVzIHRoZSBlc3NlbmNlIG9mIHRoZSBwcm9kdWN0LiBUaGUgXFxcImZvcm1hdF9zaXplXFxcIiBzaG91bGQgc3BlY2lmeSB0aGUgcXVhbnRpdHkgaW4gdW5pdHMgc3VjaCBhcyBncmFtcywgbWlsbGlsaXRlcnMsIG9yIGtpbG9ncmFtcy4gVGhlIFxcXCJjYXRlZ29yeVxcXCIgc2hvdWxkIGJlIGEgZ2VuZXJhbCBjbGFzc2lmaWNhdGlvbiBvZiB0aGUgcHJvZHVjdCBzdWNoIGFzIGZvb2QsIGZ1cm5pdHVyZSwgd2VsbC1iZWluZywgb3V0Zml0LCBiZXZlcmFnZSxmcmVzaCBmb29kLGV0Yy4gRW5zdXJlIHRoYXQgdGhlIEpTT04gb2JqZWN0IGlzIHByb3Blcmx5IGZvcm1hdHRlZCB3aXRoIGNvcnJlY3QgYXR0cmlidXRlIG5hbWVzIGFuZCB2YWx1ZXMgZW5jbG9zZWQgaW4gZG91YmxlIHF1b3Rlcy5JZiB5b3UgZG9uJ3QgZmluZCB0aGUgaW5mb3JtYXRpb24gbGVhdmUgdGhlIGF0dHJpYnV0ZSBlbXB0eS5Ta2lwIHByZWFtYnVsZSBhbmQgb25seSBnaXZlIGEgdmFsaWQgSlNPTiBpbiB5b3VyIHJlc3BvbnNlLk9ubHkgdGFrZSBlbmdsaXNoIHdvcmRzIGZyb20gdGhlIHBpY3R1cmUuIEhlcmUgaXMgdGhlIGltYWdlOlwiXG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgXSxcbiAgICAgICAgfSksXG4gICAgfVxuXG4gICAgLy8gQ3JlYXRlIHRoZSBjb21tYW5kIG9iamVjdFxuICAgIGNvbnN0IGNvbW1hbmQgPSBuZXcgSW52b2tlTW9kZWxDb21tYW5kKHBhcmFtcylcblxuICAgIHRyeSB7XG4gICAgICAgIC8vIFVzZSB0aGUgY2xpZW50IHRvIHNlbmQgdGhlIGNvbW1hbmRcbiAgICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBiZWRyb2NrQ2xpZW50LnNlbmQoY29tbWFuZClcbiAgICAgICAgY29uc3QgdGV4dERlY29kZXIgPSBuZXcgVGV4dERlY29kZXIoXCJ1dGYtOFwiKVxuICAgICAgICBjb25zdCByZXNwb25zZV9ib2R5ID0gSlNPTi5wYXJzZSh0ZXh0RGVjb2Rlci5kZWNvZGUocmVzcG9uc2UuYm9keSkpXG4gICAgICAgIGNvbnN0IHByb2R1Y3RJbmZvID0gIEpTT04ucGFyc2UocmVzcG9uc2VfYm9keS5jb250ZW50WzBdLnRleHQpXG5cbiAgICAgICAgY29uc29sZS5sb2coXCJyZXNwb25zZV9ib2R5IDogXCIscmVzcG9uc2VfYm9keSlcbiAgICAgICAgY29uc29sZS5sb2coXCJwcm9kdWN0SW5mbyA6IFwiLHByb2R1Y3RJbmZvKVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxuICAgICAgICAgICAgcHJvZHVjdEluZm9cbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycjogYW55KSB7XG4gICAgICAgIGNvbnNvbGUuZXJyb3IoXCJFcnJvciBpbnZva2luZyBCZWRyb2NrOlwiLCBlcnIpXG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzdGF0dXNDb2RlOiA1MDAsXG4gICAgICAgICAgICBoZWFkZXJzOiB7IFwiQ29udGVudC1UeXBlXCI6IFwiYXBwbGljYXRpb24vanNvblwiIH0sXG4gICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7XG4gICAgICAgICAgICAgICAgbWVzc2FnZTogXCJGYWlsZWQgdG8gdXBsb2FkIHRoZSBmaWxlXCIsXG4gICAgICAgICAgICAgICAgZXJyb3I6IGVyci5tZXNzYWdlLFxuICAgICAgICAgICAgfSksXG4gICAgICAgIH1cbiAgICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IGRlc2NyaWJlUGljdHVyZVxuIl19