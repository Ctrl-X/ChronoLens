import React, { useState } from "react"
import { InboxOutlined } from "@ant-design/icons"
import type { UploadProps } from "antd"
import { Badge, Descriptions, Image, Layout, message, Popover, Space, Upload } from "antd"
import type { DescriptionsProps } from "antd"

const { Dragger } = Upload


const ImageDescription: React.FC = ({ apigateway }) => {
    const [previewImage, setPreviewImage] = useState("")
    const [timesheetInfo, setTimesheetInfo] = useState({})
    const [processingStatus, setProcessingStatus] = useState("default")

    const exampleList = [
        "./TODO.jpg",
        "./TODO.jpg",
        "./TODO.jpg",
        "./1.jpg",
        "./TODO.jpg",
    ]
    const items: DescriptionsProps["items"] = [
        {
            key: "1",
            label: "Employee Name",
            children: timesheetInfo.employee_name
        },
        {
            key: "2",
            label: "Emplyee ID",
            children: timesheetInfo.employee_id
        },
        {
            key: "4",
            label: "Periode",
            children: timesheetInfo.pay_period
        },
        {
            key: "5",
            label: "Jours",
            children: timesheetInfo.days,
            span: 2
        }
    ]


    const props: UploadProps = {
        name: "fileFromUi",
        multiple: true,
        action: apigateway,
        onChange(info, fileList, event) {
            const { response, status } = info.file
            if (status !== "uploading") {
                setProcessingStatus("processing")
                setPreviewImage(null)
                setTimesheetInfo({})
                console.log(info.file, info.fileList)
            }
            if (status === "done") {
                message.success(`${info.file.name} file uploaded successfully.`)
                if (response && response.fileName) {
                    setPreviewImage(response.fileName)
                    setTimesheetInfo(response.timesheetInfo)
                    setProcessingStatus("success")
                }
            } else if (status === "error") {
                message.error(`${info.file.name} file upload failed.`)
                setProcessingStatus("error")
                setTimesheetInfo({ description: JSON.stringify(response) })
            }
        },
        onDrop(e) {
            console.log("Dropped files", e.dataTransfer.files)
        }
    }

    const handleExampleTimesheet = async (event, filePath) => {
        if (event) {
            event.preventDefault()
            event.stopPropagation()
        }
        await fetch(filePath)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], "photo.jpg", { type: "image/jpg" })
                const formData = new FormData()
                formData.append("fileFromUi", file)
                setProcessingStatus("processing")
                return fetch(apigateway, {
                    method: "POST",
                    body: formData
                })
            })
            .then(response => {
                if (response.ok) {
                    response.json().then(data => {
                        setPreviewImage(data.fileName)
                        setTimesheetInfo(data.timesheetInfo)
                        setProcessingStatus("success")
                    })
                } else {
                    setProcessingStatus("error")
                    console.error("Error uploading file:", response.status)
                }

            }).catch(error => {
                setProcessingStatus("error")
                setTimesheetInfo({ description: error.toString() })
                console.error("Error uploading file:", error)
            })
    }

    return <>
        <Dragger {...props}>
            <p className="ant-upload-drag-icon">
                <InboxOutlined />
            </p>
            <p className="ant-upload-text">Click or drag a file that contain some timesheet informations</p>
            <p className="ant-upload-hint">
                Support for a single upload. Strictly prohibited from uploading company data or other
                banned files.
            </p>
        </Dragger>

        <div style={{ margin: 30 }}>
            <Space>
                Timkesheet file example :
                {exampleList.map((image,index) =>
                    <Popover content={<img src={image} height={300}/>} title={"Timesheet " + index}>
                        <a href={image} target="_blank"
                           onClick={(e) => handleExampleTimesheet(e,  image )}> Product {index}</a>
                    </Popover>)}
            </Space>
        </div>
        {processingStatus === "processing" &&
            <Badge status={processingStatus} text={processingStatus} />
        }

        {processingStatus === "success" && (
            <Layout style={{ flexDirection: "row",flexWrap:"wrap" }}>
                <Image
                    style={{ paddingRight: "12px" }}
                    width={500}
                    src={previewImage}
                />
                <Descriptions column={1}
                              title="Product Info"
                              bordered items={items} />
            </Layout>
        )}
    </>
}

export default ImageDescription