"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDKExampleLambdaApiStack = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_iam_1 = require("aws-cdk-lib/aws-iam");
const aws_lambda_1 = require("aws-cdk-lib/aws-lambda");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const s3 = require("aws-cdk-lib/aws-s3");
class CDKExampleLambdaApiStack extends aws_cdk_lib_1.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        this.bucket = new s3.Bucket(this, "PictureStore");
        this.restApi = new aws_apigateway_1.RestApi(this, this.stackName + "RestApi", {
            deployOptions: {
                stageName: "beta",
                metricsEnabled: true,
                loggingLevel: aws_apigateway_1.MethodLoggingLevel.INFO,
                dataTraceEnabled: true,
            },
            binaryMediaTypes: ["multipart/form-data"],
            defaultCorsPreflightOptions: {
                allowOrigins: aws_apigateway_1.Cors.ALL_ORIGINS, // Replace with your allowed origins
                allowMethods: aws_apigateway_1.Cors.ALL_METHODS, // Allow all HTTP methods
                allowHeaders: ["*"], // Add any required headers
            },
        });
        const lambdaPolicy = new aws_iam_1.PolicyStatement();
        // Permission to call bedrock models
        lambdaPolicy.addActions("bedrock:InvokeModel");
        lambdaPolicy.addResources(`${this.bucket.bucketArn}/*`, `arn:aws:bedrock:*::foundation-model/*`);
        //Permissions to save or get file in S3
        lambdaPolicy.addActions("s3:ListBucket");
        lambdaPolicy.addActions("s3:getBucketLocation");
        lambdaPolicy.addActions("s3:GetObject");
        lambdaPolicy.addActions("s3:PutObject");
        lambdaPolicy.addResources(this.bucket.bucketArn);
        this.lambdaFunction = new aws_lambda_1.Function(this, props.functionName, {
            functionName: props.functionName,
            handler: "handler.handler",
            runtime: aws_lambda_1.Runtime.NODEJS_18_X,
            code: new aws_lambda_1.AssetCode(`./src`),
            memorySize: 512,
            // role: lambdaRole,
            timeout: aws_cdk_lib_1.Duration.seconds(300),
            environment: {
                BUCKET: this.bucket.bucketName,
                MODEL_ID: "anthropic.claude-3-haiku-20240307-v1:0",
                //MODEL_ID: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            },
        });
        this.lambdaFunction.addToRolePolicy(lambdaPolicy);
        this.restApi.root.addMethod("POST", new aws_apigateway_1.LambdaIntegration(this.lambdaFunction, {}));
    }
}
exports.CDKExampleLambdaApiStack = CDKExampleLambdaApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWJlZHJvY2stc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEtYmVkcm9jay1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFBaUc7QUFDakcsaURBQTRGO0FBQzVGLHVEQUEyRTtBQUMzRSw2Q0FBc0U7QUFDdEUseUNBQXlDO0FBT3pDLE1BQWEsd0JBQXlCLFNBQVEsbUJBQUs7SUFLL0MsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNoRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUV2QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFFakQsSUFBSSxDQUFDLE9BQU8sR0FBRyxJQUFJLHdCQUFPLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLEdBQUcsU0FBUyxFQUFFO1lBQ3pELGFBQWEsRUFBRTtnQkFDWCxTQUFTLEVBQUUsTUFBTTtnQkFDakIsY0FBYyxFQUFFLElBQUk7Z0JBQ3BCLFlBQVksRUFBRSxtQ0FBa0IsQ0FBQyxJQUFJO2dCQUNyQyxnQkFBZ0IsRUFBRSxJQUFJO2FBQ3pCO1lBQ0QsZ0JBQWdCLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUN6QywyQkFBMkIsRUFBRTtnQkFDekIsWUFBWSxFQUFFLHFCQUFJLENBQUMsV0FBVyxFQUFFLG9DQUFvQztnQkFDcEUsWUFBWSxFQUFFLHFCQUFJLENBQUMsV0FBVyxFQUFFLHlCQUF5QjtnQkFDekQsWUFBWSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsMkJBQTJCO2FBQ25EO1NBQ0osQ0FBQyxDQUFBO1FBRUYsTUFBTSxZQUFZLEdBQUcsSUFBSSx5QkFBZSxFQUFFLENBQUE7UUFDMUMsb0NBQW9DO1FBQ3BDLFlBQVksQ0FBQyxVQUFVLENBQUMscUJBQXFCLENBQUMsQ0FBQTtRQUM5QyxZQUFZLENBQUMsWUFBWSxDQUNyQixHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxJQUFJLEVBQzVCLHVDQUF1QyxDQUMxQyxDQUFBO1FBRUQsdUNBQXVDO1FBQ3ZDLFlBQVksQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUE7UUFDeEMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxzQkFBc0IsQ0FBQyxDQUFBO1FBQy9DLFlBQVksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUE7UUFDdkMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQTtRQUN2QyxZQUFZLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUE7UUFFaEQsSUFBSSxDQUFDLGNBQWMsR0FBRyxJQUFJLHFCQUFRLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxZQUFZLEVBQUU7WUFDekQsWUFBWSxFQUFFLEtBQUssQ0FBQyxZQUFZO1lBQ2hDLE9BQU8sRUFBRSxpQkFBaUI7WUFDMUIsT0FBTyxFQUFFLG9CQUFPLENBQUMsV0FBVztZQUM1QixJQUFJLEVBQUUsSUFBSSxzQkFBUyxDQUFDLE9BQU8sQ0FBQztZQUM1QixVQUFVLEVBQUUsR0FBRztZQUNmLG9CQUFvQjtZQUNwQixPQUFPLEVBQUUsc0JBQVEsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDO1lBQzlCLFdBQVcsRUFBRTtnQkFDVCxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVO2dCQUM5QixRQUFRLEVBQUUsd0NBQXdDO2dCQUNsRCx3REFBd0Q7YUFDM0Q7U0FDSixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQTtRQUNqRCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksa0NBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0lBQ3ZGLENBQUM7Q0FDSjtBQTFERCw0REEwREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb3JzLCBMYW1iZGFJbnRlZ3JhdGlvbiwgTWV0aG9kTG9nZ2luZ0xldmVsLCBSZXN0QXBpIH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1hcGlnYXRld2F5XCJcbmltcG9ydCB7IE1hbmFnZWRQb2xpY3ksIFBvbGljeVN0YXRlbWVudCwgUm9sZSwgU2VydmljZVByaW5jaXBhbCB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtaWFtXCJcbmltcG9ydCB7IEZ1bmN0aW9uLCBSdW50aW1lLCBBc3NldENvZGUsIENvZGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiXG5pbXBvcnQgeyBEdXJhdGlvbiwgU2VjcmV0VmFsdWUsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSBcImF3cy1jZGstbGliXCJcbmltcG9ydCBzMyA9IHJlcXVpcmUoXCJhd3MtY2RrLWxpYi9hd3MtczNcIilcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCJcblxuaW50ZXJmYWNlIExhbWJkYUFwaVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgICBmdW5jdGlvbk5hbWU6IHN0cmluZ1xufVxuXG5leHBvcnQgY2xhc3MgQ0RLRXhhbXBsZUxhbWJkYUFwaVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICAgIHByaXZhdGUgcmVzdEFwaTogUmVzdEFwaVxuICAgIHByaXZhdGUgbGFtYmRhRnVuY3Rpb246IEZ1bmN0aW9uXG4gICAgcHJpdmF0ZSBidWNrZXQ6IHMzLkJ1Y2tldFxuXG4gICAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExhbWJkYUFwaVN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcylcblxuICAgICAgICB0aGlzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgXCJQaWN0dXJlU3RvcmVcIilcblxuICAgICAgICB0aGlzLnJlc3RBcGkgPSBuZXcgUmVzdEFwaSh0aGlzLCB0aGlzLnN0YWNrTmFtZSArIFwiUmVzdEFwaVwiLCB7XG4gICAgICAgICAgICBkZXBsb3lPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgc3RhZ2VOYW1lOiBcImJldGFcIixcbiAgICAgICAgICAgICAgICBtZXRyaWNzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgICAgICAgICBsb2dnaW5nTGV2ZWw6IE1ldGhvZExvZ2dpbmdMZXZlbC5JTkZPLFxuICAgICAgICAgICAgICAgIGRhdGFUcmFjZUVuYWJsZWQ6IHRydWUsXG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgYmluYXJ5TWVkaWFUeXBlczogW1wibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXSxcbiAgICAgICAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICAgICAgICAgIGFsbG93T3JpZ2luczogQ29ycy5BTExfT1JJR0lOUywgLy8gUmVwbGFjZSB3aXRoIHlvdXIgYWxsb3dlZCBvcmlnaW5zXG4gICAgICAgICAgICAgICAgYWxsb3dNZXRob2RzOiBDb3JzLkFMTF9NRVRIT0RTLCAvLyBBbGxvdyBhbGwgSFRUUCBtZXRob2RzXG4gICAgICAgICAgICAgICAgYWxsb3dIZWFkZXJzOiBbXCIqXCJdLCAvLyBBZGQgYW55IHJlcXVpcmVkIGhlYWRlcnNcbiAgICAgICAgICAgIH0sXG4gICAgICAgIH0pXG5cbiAgICAgICAgY29uc3QgbGFtYmRhUG9saWN5ID0gbmV3IFBvbGljeVN0YXRlbWVudCgpXG4gICAgICAgIC8vIFBlcm1pc3Npb24gdG8gY2FsbCBiZWRyb2NrIG1vZGVsc1xuICAgICAgICBsYW1iZGFQb2xpY3kuYWRkQWN0aW9ucyhcImJlZHJvY2s6SW52b2tlTW9kZWxcIilcbiAgICAgICAgbGFtYmRhUG9saWN5LmFkZFJlc291cmNlcyhcbiAgICAgICAgICAgIGAke3RoaXMuYnVja2V0LmJ1Y2tldEFybn0vKmAsXG4gICAgICAgICAgICBgYXJuOmF3czpiZWRyb2NrOio6OmZvdW5kYXRpb24tbW9kZWwvKmAsXG4gICAgICAgIClcblxuICAgICAgICAvL1Blcm1pc3Npb25zIHRvIHNhdmUgb3IgZ2V0IGZpbGUgaW4gUzNcbiAgICAgICAgbGFtYmRhUG9saWN5LmFkZEFjdGlvbnMoXCJzMzpMaXN0QnVja2V0XCIpXG4gICAgICAgIGxhbWJkYVBvbGljeS5hZGRBY3Rpb25zKFwiczM6Z2V0QnVja2V0TG9jYXRpb25cIilcbiAgICAgICAgbGFtYmRhUG9saWN5LmFkZEFjdGlvbnMoXCJzMzpHZXRPYmplY3RcIilcbiAgICAgICAgbGFtYmRhUG9saWN5LmFkZEFjdGlvbnMoXCJzMzpQdXRPYmplY3RcIilcbiAgICAgICAgbGFtYmRhUG9saWN5LmFkZFJlc291cmNlcyh0aGlzLmJ1Y2tldC5idWNrZXRBcm4pXG5cbiAgICAgICAgdGhpcy5sYW1iZGFGdW5jdGlvbiA9IG5ldyBGdW5jdGlvbih0aGlzLCBwcm9wcy5mdW5jdGlvbk5hbWUsIHtcbiAgICAgICAgICAgIGZ1bmN0aW9uTmFtZTogcHJvcHMuZnVuY3Rpb25OYW1lLFxuICAgICAgICAgICAgaGFuZGxlcjogXCJoYW5kbGVyLmhhbmRsZXJcIixcbiAgICAgICAgICAgIHJ1bnRpbWU6IFJ1bnRpbWUuTk9ERUpTXzE4X1gsXG4gICAgICAgICAgICBjb2RlOiBuZXcgQXNzZXRDb2RlKGAuL3NyY2ApLFxuICAgICAgICAgICAgbWVtb3J5U2l6ZTogNTEyLFxuICAgICAgICAgICAgLy8gcm9sZTogbGFtYmRhUm9sZSxcbiAgICAgICAgICAgIHRpbWVvdXQ6IER1cmF0aW9uLnNlY29uZHMoMzAwKSxcbiAgICAgICAgICAgIGVudmlyb25tZW50OiB7XG4gICAgICAgICAgICAgICAgQlVDS0VUOiB0aGlzLmJ1Y2tldC5idWNrZXROYW1lLFxuICAgICAgICAgICAgICAgIE1PREVMX0lEOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1oYWlrdS0yMDI0MDMwNy12MTowXCIsXG4gICAgICAgICAgICAgICAgLy9NT0RFTF9JRDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDA2MjAtdjE6MFwiLFxuICAgICAgICAgICAgfSxcbiAgICAgICAgfSlcblxuICAgICAgICB0aGlzLmxhbWJkYUZ1bmN0aW9uLmFkZFRvUm9sZVBvbGljeShsYW1iZGFQb2xpY3kpXG4gICAgICAgIHRoaXMucmVzdEFwaS5yb290LmFkZE1ldGhvZChcIlBPU1RcIiwgbmV3IExhbWJkYUludGVncmF0aW9uKHRoaXMubGFtYmRhRnVuY3Rpb24sIHt9KSlcbiAgICB9XG59XG4iXX0=