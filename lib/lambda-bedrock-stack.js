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
        lambdaPolicy.addResources(`${this.bucket.bucketArn}/*`, "arn:aws:bedrock:*:*:foundation-model/*", "arn:aws:bedrock:*:*:model/*", "arn:aws:bedrock:*:*:inference-profile/*");
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
                MODEL_ID: "us.amazon.nova-pro-v1:0",
                //MODEL_ID: "anthropic.claude-3-5-sonnet-20241022-v2:0",
                // MODEL_ID: "anthropic.claude-3-haiku-20240307-v1:0",
                //MODEL_ID: "anthropic.claude-3-5-sonnet-20240620-v1:0",
            },
        });
        this.lambdaFunction.addToRolePolicy(lambdaPolicy);
        this.restApi.root.addMethod("POST", new aws_apigateway_1.LambdaIntegration(this.lambdaFunction, {}));
    }
}
exports.CDKExampleLambdaApiStack = CDKExampleLambdaApiStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFtYmRhLWJlZHJvY2stc3RhY2suanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJsYW1iZGEtYmVkcm9jay1zdGFjay50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSwrREFLb0M7QUFDcEMsaURBSzZCO0FBQzdCLHVEQUE0RTtBQUM1RSw2Q0FBdUU7QUFDdkUseUNBQTBDO0FBTzFDLE1BQWEsd0JBQXlCLFNBQVEsbUJBQUs7SUFLakQsWUFBWSxLQUFnQixFQUFFLEVBQVUsRUFBRSxLQUEwQjtRQUNsRSxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsQ0FBQztRQUV4QixJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztRQUVwRCxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksd0JBQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLEVBQUU7WUFDM0QsYUFBYSxFQUFFO2dCQUNiLFNBQVMsRUFBRSxNQUFNO2dCQUNqQixjQUFjLEVBQUUsSUFBSTtnQkFDcEIsWUFBWSxFQUFFLG1DQUFrQixDQUFDLElBQUk7Z0JBQ3JDLGdCQUFnQixFQUFFLElBQUk7YUFDdkI7WUFDRCxnQkFBZ0IsRUFBRSxDQUFDLHFCQUFxQixDQUFDO1lBQ3pDLDJCQUEyQixFQUFFO2dCQUMzQixZQUFZLEVBQUUscUJBQUksQ0FBQyxXQUFXLEVBQUUsb0NBQW9DO2dCQUNwRSxZQUFZLEVBQUUscUJBQUksQ0FBQyxXQUFXLEVBQUUseUJBQXlCO2dCQUN6RCxZQUFZLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSwyQkFBMkI7YUFDakQ7U0FDRixDQUFDLENBQUM7UUFFSCxNQUFNLFlBQVksR0FBRyxJQUFJLHlCQUFlLEVBQUUsQ0FBQztRQUMzQyxvQ0FBb0M7UUFDcEMsWUFBWSxDQUFDLFVBQVUsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDO1FBQy9DLFlBQVksQ0FBQyxZQUFZLENBQ3ZCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxTQUFTLElBQUksRUFDNUIsd0NBQXdDLEVBQ3hDLDZCQUE2QixFQUM3Qix5Q0FBeUMsQ0FDMUMsQ0FBQztRQUVGLHVDQUF1QztRQUN2QyxZQUFZLENBQUMsVUFBVSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1FBQ3pDLFlBQVksQ0FBQyxVQUFVLENBQUMsc0JBQXNCLENBQUMsQ0FBQztRQUNoRCxZQUFZLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxDQUFDO1FBQ3hDLFlBQVksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDeEMsWUFBWSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBRWpELElBQUksQ0FBQyxjQUFjLEdBQUcsSUFBSSxxQkFBUSxDQUFDLElBQUksRUFBRSxLQUFLLENBQUMsWUFBWSxFQUFFO1lBQzNELFlBQVksRUFBRSxLQUFLLENBQUMsWUFBWTtZQUNoQyxPQUFPLEVBQUUsaUJBQWlCO1lBQzFCLE9BQU8sRUFBRSxvQkFBTyxDQUFDLFdBQVc7WUFDNUIsSUFBSSxFQUFFLElBQUksc0JBQVMsQ0FBQyxPQUFPLENBQUM7WUFDNUIsVUFBVSxFQUFFLEdBQUc7WUFDZixvQkFBb0I7WUFDcEIsT0FBTyxFQUFFLHNCQUFRLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQztZQUM5QixXQUFXLEVBQUU7Z0JBQ1gsTUFBTSxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVTtnQkFDOUIsUUFBUSxFQUFFLHlCQUF5QjtnQkFDbkMsd0RBQXdEO2dCQUN4RCxzREFBc0Q7Z0JBQ3RELHdEQUF3RDthQUN6RDtTQUNGLENBQUMsQ0FBQztRQUVILElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLFlBQVksQ0FBQyxDQUFDO1FBQ2xELElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FDekIsTUFBTSxFQUNOLElBQUksa0NBQWlCLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLENBQUMsQ0FDL0MsQ0FBQztJQUNKLENBQUM7Q0FDRjtBQWpFRCw0REFpRUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1xuICBDb3JzLFxuICBMYW1iZGFJbnRlZ3JhdGlvbixcbiAgTWV0aG9kTG9nZ2luZ0xldmVsLFxuICBSZXN0QXBpLFxufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWFwaWdhdGV3YXlcIjtcbmltcG9ydCB7XG4gIE1hbmFnZWRQb2xpY3ksXG4gIFBvbGljeVN0YXRlbWVudCxcbiAgUm9sZSxcbiAgU2VydmljZVByaW5jaXBhbCxcbn0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1pYW1cIjtcbmltcG9ydCB7IEZ1bmN0aW9uLCBSdW50aW1lLCBBc3NldENvZGUsIENvZGUgfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYVwiO1xuaW1wb3J0IHsgRHVyYXRpb24sIFNlY3JldFZhbHVlLCBTdGFjaywgU3RhY2tQcm9wcyB9IGZyb20gXCJhd3MtY2RrLWxpYlwiO1xuaW1wb3J0IHMzID0gcmVxdWlyZShcImF3cy1jZGstbGliL2F3cy1zM1wiKTtcbmltcG9ydCB7IENvbnN0cnVjdCB9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5cbmludGVyZmFjZSBMYW1iZGFBcGlTdGFja1Byb3BzIGV4dGVuZHMgU3RhY2tQcm9wcyB7XG4gIGZ1bmN0aW9uTmFtZTogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgQ0RLRXhhbXBsZUxhbWJkYUFwaVN0YWNrIGV4dGVuZHMgU3RhY2sge1xuICBwcml2YXRlIHJlc3RBcGk6IFJlc3RBcGk7XG4gIHByaXZhdGUgbGFtYmRhRnVuY3Rpb246IEZ1bmN0aW9uO1xuICBwcml2YXRlIGJ1Y2tldDogczMuQnVja2V0O1xuXG4gIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzOiBMYW1iZGFBcGlTdGFja1Byb3BzKSB7XG4gICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG5cbiAgICB0aGlzLmJ1Y2tldCA9IG5ldyBzMy5CdWNrZXQodGhpcywgXCJUaW1lc2hlZXRTdG9yZVwiKTtcblxuICAgIHRoaXMucmVzdEFwaSA9IG5ldyBSZXN0QXBpKHRoaXMsIHRoaXMuc3RhY2tOYW1lICsgXCJSZXN0QXBpXCIsIHtcbiAgICAgIGRlcGxveU9wdGlvbnM6IHtcbiAgICAgICAgc3RhZ2VOYW1lOiBcImJldGFcIixcbiAgICAgICAgbWV0cmljc0VuYWJsZWQ6IHRydWUsXG4gICAgICAgIGxvZ2dpbmdMZXZlbDogTWV0aG9kTG9nZ2luZ0xldmVsLklORk8sXG4gICAgICAgIGRhdGFUcmFjZUVuYWJsZWQ6IHRydWUsXG4gICAgICB9LFxuICAgICAgYmluYXJ5TWVkaWFUeXBlczogW1wibXVsdGlwYXJ0L2Zvcm0tZGF0YVwiXSxcbiAgICAgIGRlZmF1bHRDb3JzUHJlZmxpZ2h0T3B0aW9uczoge1xuICAgICAgICBhbGxvd09yaWdpbnM6IENvcnMuQUxMX09SSUdJTlMsIC8vIFJlcGxhY2Ugd2l0aCB5b3VyIGFsbG93ZWQgb3JpZ2luc1xuICAgICAgICBhbGxvd01ldGhvZHM6IENvcnMuQUxMX01FVEhPRFMsIC8vIEFsbG93IGFsbCBIVFRQIG1ldGhvZHNcbiAgICAgICAgYWxsb3dIZWFkZXJzOiBbXCIqXCJdLCAvLyBBZGQgYW55IHJlcXVpcmVkIGhlYWRlcnNcbiAgICAgIH0sXG4gICAgfSk7XG5cbiAgICBjb25zdCBsYW1iZGFQb2xpY3kgPSBuZXcgUG9saWN5U3RhdGVtZW50KCk7XG4gICAgLy8gUGVybWlzc2lvbiB0byBjYWxsIGJlZHJvY2sgbW9kZWxzXG4gICAgbGFtYmRhUG9saWN5LmFkZEFjdGlvbnMoXCJiZWRyb2NrOkludm9rZU1vZGVsXCIpO1xuICAgIGxhbWJkYVBvbGljeS5hZGRSZXNvdXJjZXMoXG4gICAgICBgJHt0aGlzLmJ1Y2tldC5idWNrZXRBcm59LypgLFxuICAgICAgXCJhcm46YXdzOmJlZHJvY2s6KjoqOmZvdW5kYXRpb24tbW9kZWwvKlwiLFxuICAgICAgXCJhcm46YXdzOmJlZHJvY2s6KjoqOm1vZGVsLypcIixcbiAgICAgIFwiYXJuOmF3czpiZWRyb2NrOio6KjppbmZlcmVuY2UtcHJvZmlsZS8qXCIsXG4gICAgKTtcblxuICAgIC8vUGVybWlzc2lvbnMgdG8gc2F2ZSBvciBnZXQgZmlsZSBpbiBTM1xuICAgIGxhbWJkYVBvbGljeS5hZGRBY3Rpb25zKFwiczM6TGlzdEJ1Y2tldFwiKTtcbiAgICBsYW1iZGFQb2xpY3kuYWRkQWN0aW9ucyhcInMzOmdldEJ1Y2tldExvY2F0aW9uXCIpO1xuICAgIGxhbWJkYVBvbGljeS5hZGRBY3Rpb25zKFwiczM6R2V0T2JqZWN0XCIpO1xuICAgIGxhbWJkYVBvbGljeS5hZGRBY3Rpb25zKFwiczM6UHV0T2JqZWN0XCIpO1xuICAgIGxhbWJkYVBvbGljeS5hZGRSZXNvdXJjZXModGhpcy5idWNrZXQuYnVja2V0QXJuKTtcblxuICAgIHRoaXMubGFtYmRhRnVuY3Rpb24gPSBuZXcgRnVuY3Rpb24odGhpcywgcHJvcHMuZnVuY3Rpb25OYW1lLCB7XG4gICAgICBmdW5jdGlvbk5hbWU6IHByb3BzLmZ1bmN0aW9uTmFtZSxcbiAgICAgIGhhbmRsZXI6IFwiaGFuZGxlci5oYW5kbGVyXCIsXG4gICAgICBydW50aW1lOiBSdW50aW1lLk5PREVKU18xOF9YLFxuICAgICAgY29kZTogbmV3IEFzc2V0Q29kZShgLi9zcmNgKSxcbiAgICAgIG1lbW9yeVNpemU6IDUxMixcbiAgICAgIC8vIHJvbGU6IGxhbWJkYVJvbGUsXG4gICAgICB0aW1lb3V0OiBEdXJhdGlvbi5zZWNvbmRzKDMwMCksXG4gICAgICBlbnZpcm9ubWVudDoge1xuICAgICAgICBCVUNLRVQ6IHRoaXMuYnVja2V0LmJ1Y2tldE5hbWUsXG4gICAgICAgIE1PREVMX0lEOiBcInVzLmFtYXpvbi5ub3ZhLXByby12MTowXCIsXG4gICAgICAgIC8vTU9ERUxfSUQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLTUtc29ubmV0LTIwMjQxMDIyLXYyOjBcIixcbiAgICAgICAgLy8gTU9ERUxfSUQ6IFwiYW50aHJvcGljLmNsYXVkZS0zLWhhaWt1LTIwMjQwMzA3LXYxOjBcIixcbiAgICAgICAgLy9NT0RFTF9JRDogXCJhbnRocm9waWMuY2xhdWRlLTMtNS1zb25uZXQtMjAyNDA2MjAtdjE6MFwiLFxuICAgICAgfSxcbiAgICB9KTtcblxuICAgIHRoaXMubGFtYmRhRnVuY3Rpb24uYWRkVG9Sb2xlUG9saWN5KGxhbWJkYVBvbGljeSk7XG4gICAgdGhpcy5yZXN0QXBpLnJvb3QuYWRkTWV0aG9kKFxuICAgICAgXCJQT1NUXCIsXG4gICAgICBuZXcgTGFtYmRhSW50ZWdyYXRpb24odGhpcy5sYW1iZGFGdW5jdGlvbiwge30pLFxuICAgICk7XG4gIH1cbn1cbiJdfQ==