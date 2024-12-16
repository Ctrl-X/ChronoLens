const multipart = require("aws-lambda-multipart-parser");

import uploadToS3 from "./utils/s3Utils";
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

      // fileFromUi is the form-data key associated to the file in the multipart
      const tmpFile = formObject.fileFromUi;

      // Get employee info from POST parameters
      const employeeName = formObject.employee_name;
      const employeeId = formObject.employee_id;

      if (!employeeName || !employeeId) {
        // if no specific employee is provided,we get the list of all employees
        const result = await getEmployeeList(tmpFile);
        statusCode = result.statusCode;
        if (result.statusCode !== 200) {
          return result;
        }
        bodyResult = {
          employeeList: result.employeeInfo,
        };
        // Optional :  Example of uploading the file in S3
        const s3result = await uploadToS3(tmpFile);
        if (s3result.statusCode == 200) {
          const { fileName } = s3result;
          bodyResult = { ...bodyResult, fileName };
        }
      } else {
        // Get timesheets for the specified employee
        const bedRockResult = await getEmployeeTimesheet(
          tmpFile,
          employeeName,
          employeeId,
        );

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
