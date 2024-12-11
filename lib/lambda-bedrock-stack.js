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
        this.bucket = new s3.Bucket(this, "TimesheetStore");
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
                MODEL_ID: "anthropic.claude-3-5-sonnet-20241022-v2:0",
                // MODEL_ID: "anthropic.claude-3-haiku-20240307-v1:0",
                //MODEL_ID: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            },
        });
        this.lambdaFunction.addToRolePolicy(lambdaPolicy);
        this.restApi.root.addMethod("POST", new aws_apigateway_1.LambdaIntegration(this.lambdaFunction, {}));
    }
}
exports.CDKExampleLambdaApiStack = CDKExampleLambdaApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWJlZHJvY2stc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEtYmVkcm9jay1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFLb0M7QUFDcEMsaURBSzZCO0FBQzdCLHVEQUE0RTtBQUM1RSw2Q0FBdUU7QUFDdkUseUNBQTBDO0FBTzFDLE1BQWEsd0JBQXlCLFNBQVEsbUJBQUs7SUFLakQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksd0JBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLEVBQUU7WUFDM0QsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixjQUFjLEVBQUUsSUFBSTtnQkFDcEIsWUFBWSxFQUFFLG1DQUFrQixDQUFDLElBQUk7Z0JBQ3JDLGdCQUFnQixFQUFFLElBQUk7YUFDdkI7WUFDRCxnQkFBZ0IsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1lBQ3pDLDJCQUEyQixFQUFFO2dCQUMzQixZQUFZLEVBQUUscUJBQUksQ0FBQyxXQUFXLEVBQUUsb0NBQW9DO2dCQUNwRSxZQUFZLEVBQUUscUJBQUksQ0FBQyxXQUFXLEVBQUUseUJBQXlCO2dCQUN6RCxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSwyQkFBMkI7YUFDakQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUMzQyxvQ0FBb0M7UUFDcEMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQy9DLFlBQVksQ0FBQyxZQUFZLENBQ3ZCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFDNUIsdUNBQXVDLENBQ3hDLENBQUM7UUFFRix1Q0FBdUM7UUFDdkMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQztRQUN6QyxZQUFZLENBQUMsVUFBVSxDQUFDLHNCQUFzQixDQUFDLENBQUM7UUFDaEQsWUFBWSxDQUFDLFVBQVUsQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUN4QyxZQUFZLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hDLFlBQVksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLENBQUMsQ0FBQztRQUVqRCxJQUFJLENBQUMsY0FBYyxHQUFHLElBQUkscUJBQVEsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLFlBQVksRUFBRTtZQUMzRCxZQUFZLEVBQUUsS0FBSyxDQUFDLFlBQVk7WUFDaEMsT0FBTyxFQUFFLGlCQUFpQjtZQUMxQixPQUFPLEVBQUUsb0JBQU8sQ0FBQyxXQUFXO1lBQzVCLElBQUksRUFBRSxJQUFJLHNCQUFTLENBQUMsT0FBTyxDQUFDO1lBQzVCLFVBQVUsRUFBRSxHQUFHO1lBQ2Ysb0JBQW9CO1lBQ3BCLE9BQU8sRUFBRSxzQkFBUSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUM7WUFDOUIsV0FBVyxFQUFFO2dCQUNYLE1BQU0sRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLFVBQVU7Z0JBQzlCLFFBQVEsRUFBRSwyQ0FBMkM7Z0JBQ3JELHNEQUFzRDtnQkFDdEQsd0RBQXdEO2FBQ3pEO1NBQ0YsQ0FBQyxDQUFDO1FBRUgsSUFBSSxDQUFDLGNBQWMsQ0FBQyxlQUFlLENBQUMsWUFBWSxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUN6QixNQUFNLEVBQ04sSUFBSSxrQ0FBaUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsQ0FBQyxDQUMvQyxDQUFDO0lBQ0osQ0FBQztDQUNGO0FBOURELDREQThEQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gIENvcnMsXG4gIExhbWJkYUludGVncmF0aW9uLFxuICBNZXRob2RMb2dnaW5nTGV2ZWwsXG4gIFJlc3RBcGksXG59IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0IHtcbiAgTWFuYWdlZFBvbGljeSxcbiAgUG9saWN5U3RhdGVtZW50LFxuICBSb2xlLFxuICBTZXJ2aWNlUHJpbmNpcGFsLFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWlhbVwiO1xuaW1wb3J0IHsgRnVuY3Rpb24sIFJ1bnRpbWUsIEFzc2V0Q29kZSwgQ29kZSB9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhXCI7XG5pbXBvcnQgeyBEdXJhdGlvbiwgU2VjcmV0VmFsdWUsIFN0YWNrLCBTdGFja1Byb3BzIH0gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQgczMgPSByZXF1aXJlKFwiYXdzLWNkay1saWIvYXdzLXMzXCIpO1xuaW1wb3J0IHsgQ29uc3RydWN0IH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcblxuaW50ZXJmYWNlIExhbWJkYUFwaVN0YWNrUHJvcHMgZXh0ZW5kcyBTdGFja1Byb3BzIHtcbiAgZnVuY3Rpb25OYW1lOiBzdHJpbmc7XG59XG5cbmV4cG9ydCBjbGFzcyBDREtFeGFtcGxlTGFtYmRhQXBpU3RhY2sgZXh0ZW5kcyBTdGFjayB7XG4gIHByaXZhdGUgcmVzdEFwaTogUmVzdEFwaTtcbiAgcHJpdmF0ZSBsYW1iZGFGdW5jdGlvbjogRnVuY3Rpb247XG4gIHByaXZhdGUgYnVja2V0OiBzMy5CdWNrZXQ7XG5cbiAgY29uc3RydWN0b3Ioc2NvcGU6IENvbnN0cnVjdCwgaWQ6IHN0cmluZywgcHJvcHM6IExhbWJkYUFwaVN0YWNrUHJvcHMpIHtcbiAgICBzdXBlcihzY29wZSwgaWQsIHByb3BzKTtcblxuICAgIHRoaXMuYnVja2V0ID0gbmV3IHMzLkJ1Y2tldCh0aGlzLCBcIlRpbWVzaGVldFN0b3JlXCIpO1xuXG4gICAgdGhpcy5yZXN0QXBpID0gbmV3IFJlc3RBcGkodGhpcywgdGhpcy5zdGFja05hbWUgKyBcIlJlc3RBcGlcIiwge1xuICAgICAgZGVwbG95T3B0aW9uczoge1xuICAgICAgICBzdGFnZU5hbWU6IFwiYmV0YVwiLFxuICAgICAgICBtZXRyaWNzRW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgbG9nZ2luZ0xldmVsOiBNZXRob2RMb2dnaW5nTGV2ZWwuSU5GTyxcbiAgICAgICAgZGF0YVRyYWNlRW5hYmxlZDogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBiaW5hcnlNZWRpYVR5cGVzOiBbXCJtdWx0aXBhcnQvZm9ybS1kYXRhXCJdLFxuICAgICAgZGVmYXVsdENvcnNQcmVmbGlnaHRPcHRpb25zOiB7XG4gICAgICAgIGFsbG93T3JpZ2luczogQ29ycy5BTExfT1JJR0lOUywgLy8gUmVwbGFjZSB3aXRoIHlvdXIgYWxsb3dlZCBvcmlnaW5zXG4gICAgICAgIGFsbG93TWV0aG9kczogQ29ycy5BTExfTUVUSE9EUywgLy8gQWxsb3cgYWxsIEhUVFAgbWV0aG9kc1xuICAgICAgICBhbGxvd0hlYWRlcnM6IFtcIipcIl0sIC8vIEFkZCBhbnkgcmVxdWlyZWQgaGVhZGVyc1xuICAgICAgfSxcbiAgICB9KTtcblxuICAgIGNvbnN0IGxhbWJkYVBvbGljeSA9IG5ldyBQb2xpY3lTdGF0ZW1lbnQoKTtcbiAgICAvLyBQZXJtaXNzaW9uIHRvIGNhbGwgYmVkcm9jayBtb2RlbHNcbiAgICBsYW1iZGFQb2xpY3kuYWRkQWN0aW9ucyhcImJlZHJvY2s6SW52b2tlTW9kZWxcIik7XG4gICAgbGFtYmRhUG9saWN5LmFkZFJlc291cmNlcyhcbiAgICAgIGAke3RoaXMuYnVja2V0LmJ1Y2tldEFybn0vKmAsXG4gICAgICBgYXJuOmF3czpiZWRyb2NrOio6OmZvdW5kYXRpb24tbW9kZWwvKmAsXG4gICAgKTtcblxuICAgIC8vUGVybWlzc2lvbnMgdG8gc2F2ZSBvciBnZXQgZmlsZSBpbiBTM1xuICAgIGxhbWJkYVBvbGljeS5hZGRBY3Rpb25zKFwiczM6TGlzdEJ1Y2tldFwiKTtcbiAgICBsYW1iZGFQb2xpY3kuYWRkQWN0aW9ucyhcInMzOmdldEJ1Y2tldExvY2F0aW9uXCIpO1xuICAgIGxhbWJkYVBvbGljeS5hZGRBY3Rpb25zKFwiczM6R2V0T2JqZWN0XCIpO1xuICAgIGxhbWJkYVBvbGljeS5hZGRBY3Rpb25zKFwiczM6UHV0T2JqZWN0XCIpO1xuICAgIGxhbWJkYVBvbGljeS5hZGRSZXNvdXJjZXModGhpcy5idWNrZXQuYnVja2V0QXJuKTtcblxuICAgIHRoaXMubGFtYmRhRnVuY3Rpb24gPSBuZXcgRnVuY3Rpb24odGhpcywgcHJvcHMuZnVuY3Rpb25OYW1lLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IHByb3BzLmZ1bmN0aW9uTmFtZSxcbiAgICAgIGhhbmRsZXI6IFwiaGFuZGxlci5oYW5kbGVyXCIsXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgY29kZTogbmV3IEFzc2V0Q29kZShgLi9zcmNgKSxcbiAgICAgIG1lbW9yeVNpemU6IDUxMixcbiAgICAgIC8vIHJvbGU6IGxhbWJkYVJvbGUsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwMCksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBCVUNLRVQ6IHRoaXMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIE1PREVMX0lEOiBcImFudGhyb3BpYy5jbGF1ZGUtMy01LXNvbm5ldC0yMDI0MTAyMi12MjowXCIsXG4gICAgICAgIC8vIE1PREVMX0lEOiBcImFudGhyb3BpYy5jbGF1ZGUtMy1oYWlrdS0yMDI0MDMwNy12MTowXCIsXG4gICAgICAgIC8vTU9ERUxfSUQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLTUtc29ubmV0LTIwMjQwNjIwLXYxOjBcIixcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICB0aGlzLmxhbWJkYUZ1bmN0aW9uLmFkZFRvUm9sZVBvbGljeShsYW1iZGFQb2xpY3kpO1xuICAgIHRoaXMucmVzdEFwaS5yb290LmFkZE1ldGhvZChcbiAgICAgIFwiUE9TVFwiLFxuICAgICAgbmV3IExhbWJkYUludGVncmF0aW9uKHRoaXMubGFtYmRhRnVuY3Rpb24sIHt9KSxcbiAgICApO1xuICB9XG59XG4iXX0=