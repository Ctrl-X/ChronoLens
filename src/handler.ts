const multipart = require("aws-lambda-multipart-parser");

import { uploadToS3, loadFromS3 } from "./utils/s3Utils";
import { getEmployeeTimesheet, getEmployeeList } from "./utils/bedrockUtils";

const handler = async function (event: any, context: any) {
  let statusCode = 400;
  let bodyResult = null;

  try {
    let method = event.httpMethod;
    console.log("method", method);
    if (method != "POST" || event.path !== "/") {
      // We only accept POST
      bodyResult = "We only accept POST";
    } else {
      // parse the base64 from the API Gateway
      const base64Body = event.body;
      const buff = Buffer.from(base64Body, "base64");
      const decodedEventBody = buff.toString("latin1");
      const decodedEvent = { ...event, body: decodedEventBody };
      const formObject = multipart.parse(decodedEvent, false);

      // Get employee info from POST parameters
      const employeeName = formObject.employee_name;
      const employeeId = formObject.employee_id;

      if (!employeeName || !employeeId) {
        // if no specific employee is provided, we need to extract them from the file
        // fileFromUi is the form-data key associated to the file in the multipart
        const tmpFile = formObject.fileFromUi;
        // Uploading the file in S3
        const s3result = await uploadToS3(tmpFile);
        const { fileName } = s3result;
        if (s3result.statusCode !== 200) {
          return s3result; // failed to upload to s3
        }

        // we get the list of all employees from the uploaded picture
        const result = await getEmployeeList(tmpFile);
        statusCode = result.statusCode;
        if (result.statusCode !== 200) {
          return result; // failed to call bedrock
        }
        bodyResult = {
          employeeList: result.employeeInfo,
          fileName,
        };
      } else {
        // Get timesheets for the specified employee
        const s3Filename = formObject.s3Filename;
        const fileBuffer = await loadFromS3(s3Filename);
        const bedRockResult = await getEmployeeTimesheet(
          s3Filename,
          fileBuffer,
          employeeName,
          employeeId,
        );
        statusCode = bedRockResult.statusCode;

        if (bedRockResult.statusCode === 200) {
          bodyResult = {
            timesheetInfo: bedRockResult.timesheetInfo,
          };
        } else {
          return bedRockResult;
        }
      }
    }
  } catch (error) {
    if (error instanceof Error) {
      bodyResult = error.stack;
    } else {
      bodyResult = error;
    }
  }

  const result = {
    statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(bodyResult),
  };
  console.log("final result", result);
  return result;
};

export { handler };
