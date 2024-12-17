import React, {useState} from "react"
import {InboxOutlined} from "@ant-design/icons"
import type {UploadProps} from "antd"
import {Spin, message, Tree, Upload} from "antd"
import {JSONTree} from 'react-json-tree';


const {Dragger} = Upload
const TimesheetDescription: React.FC = ({apigateway}) => {
    const [fileName, setFileName] = useState({})
    const [employeeList, setEmployeeList] = useState([])
    const [timesheetInfo, setTimesheetInfo] = useState({})
    const [processingStatus, setProcessingStatus] = useState("default")

    const [loadingEmployees, setLoadingEmployees] = useState({});


    const props: UploadProps = {
        name: "fileFromUi",
        multiple: false,
        action: apigateway,
        onChange(info, fileList, event) {

            console.log("info", info)
            const {response, status} = info.file
            if (status !== "uploading") {
                setProcessingStatus("processing")
                setEmployeeList([])
                setFileName(null)
            }
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`)
                if (response && response.fileName) {
                    let employeeList = JSON.parse(response.employeeList)
                    if (employeeList.employees) {
                        employeeList = employeeList.employees
                    }
                    setEmployeeList(employeeList)
                    setFileName(response.fileName)

                    if (employeeList && employeeList.length > 0) {
                        const treeData = employeeList.map(({id, name}) => ({
                            key: name,
                            title: `${name} (ID: ${id})`,
                            children: [{key: `${name}-loading`, title: <Spin spinning/>}]
                        }));
                        console.log("employees", treeData)
                        setTimesheetInfo(treeData)
                    }
                    setProcessingStatus("success")


                }
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`)
                setProcessingStatus("error")
                setTimesheetInfo({description: JSON.stringify(response)})
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files)
        }
    }

    const handleEmployeeExpand = async (employeeId, employeeName) => {
        setLoadingEmployees(prev => ({...prev, [employeeId]: true}));

        const formData = new FormData();
        formData.append('s3Filename', fileName);
        formData.append('employee_id', employeeId);
        formData.append('employee_name', employeeName);

        try {
            const response = await fetch(apigateway, {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            const parsedTimesheet = JSON.parse(data.timesheetInfo);
            console.log("parsedTimesheet", parsedTimesheet)
            const updatedTimesheetInfo = timesheetInfo.map((node, index) => {
                if (node.key === employeeId) {
                    return {
                        ...node,
                        children: [
                            {
                                title: <JSONTree data={parsedTimesheet[0]}/>,
                                key: `${employeeId}-${index}`
                            }]
                    };
                }
                return node;
            });
            setTimesheetInfo(updatedTimesheetInfo)
        } catch (error) {
            console.error('Error fetching employee data:', error);
        } finally {
            setLoadingEmployees(prev => ({...prev, [employeeId]: false}));
        }
    };

    const renderTreeNodes = (data) => {
        if (!data) return [{key: `0-loading`, title: <Spin spinning/>}];
        return Object.entries(data).map(([key, value]) => {
            if (typeof value === 'object' && value !== null) {
                return {
                    title: key,
                    key: key,
                    children: renderTreeNodes(value)
                };
            }
            return {
                title: `${key}: ${value}`,
                key: `${key}-${value}`
            };
        });
    };


    return <>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click or drag a file that contain some timesheet informations</p>
            <p className="ant-upload-hint">
                Support for a single upload. Strictly prohibited from uploading company data or other
                banned files.
            </p>
        </Dragger>


        {processingStatus === "processing" && <Spin/>}

        {processingStatus === "success" && (
            <Tree style={{flex: 1, width: "100%"}}
                  treeData={timesheetInfo}
                  onExpand={(expandedKeys, {expanded, node}) => {
                      if (expanded) {
                          handleEmployeeExpand(node.key, employeeList.find(e => e.id === node.key)?.name);
                      }
                  }}
            />
        )}
    </>
}

export default TimesheetDescription