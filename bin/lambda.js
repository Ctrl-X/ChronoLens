#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lambdaFunctionName = void 0;
require("source-map-support/register");
const cdk = require("aws-cdk-lib");
const lambda_bedrock_stack_1 = require("../lib/lambda-bedrock-stack");
exports.lambdaFunctionName = "ImageDescriptionFunction";
const app = new cdk.App();
new lambda_bedrock_stack_1.CDKExampleLambdaApiStack(app, "CDKImageDescriptionStack", {
    functionName: exports.lambdaFunctionName,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsibGFtYmRhLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSx1Q0FBb0M7QUFDcEMsbUNBQW1DO0FBQ25DLHNFQUFzRTtBQUV6RCxRQUFBLGtCQUFrQixHQUFHLDBCQUEwQixDQUFBO0FBRTVELE1BQU0sR0FBRyxHQUFHLElBQUksR0FBRyxDQUFDLEdBQUcsRUFBRSxDQUFBO0FBQ3pCLElBQUksK0NBQXdCLENBQUMsR0FBRyxFQUFFLDBCQUEwQixFQUFFO0lBQzFELFlBQVksRUFBRSwwQkFBa0I7Q0FDbkMsQ0FBQyxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuaW1wb3J0IFwic291cmNlLW1hcC1zdXBwb3J0L3JlZ2lzdGVyXCJcbmltcG9ydCBjZGsgPSByZXF1aXJlKFwiYXdzLWNkay1saWJcIilcbmltcG9ydCB7IENES0V4YW1wbGVMYW1iZGFBcGlTdGFjayB9IGZyb20gXCIuLi9saWIvbGFtYmRhLWJlZHJvY2stc3RhY2tcIlxuXG5leHBvcnQgY29uc3QgbGFtYmRhRnVuY3Rpb25OYW1lID0gXCJJbWFnZURlc2NyaXB0aW9uRnVuY3Rpb25cIlxuXG5jb25zdCBhcHAgPSBuZXcgY2RrLkFwcCgpXG5uZXcgQ0RLRXhhbXBsZUxhbWJkYUFwaVN0YWNrKGFwcCwgXCJDREtJbWFnZURlc2NyaXB0aW9uU3RhY2tcIiwge1xuICAgIGZ1bmN0aW9uTmFtZTogbGFtYmRhRnVuY3Rpb25OYW1lLFxufSlcbiJdfQ==