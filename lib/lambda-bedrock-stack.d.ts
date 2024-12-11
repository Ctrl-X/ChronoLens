import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
interface LambdaApiStackProps extends StackProps {
    functionName: string;
}
export declare class CDKExampleLambdaApiStack extends Stack {
    private restApi;
    private lambdaFunction;
    private bucket;
    constructor(scope: Construct, id: string, props: LambdaApiStackProps);
}
export {};
