#!/usr/bin/env node
import "source-map-support/register";
import cdk = require("aws-cdk-lib");
import { CDKExampleLambdaApiStack } from "../lib/lambda-bedrock-stack";

export const lambdaFunctionName = "ChronoLensFunction";

const app = new cdk.App();
new CDKExampleLambdaApiStack(app, "CDKChronoLensStack", {
  functionName: lambdaFunctionName,
});
