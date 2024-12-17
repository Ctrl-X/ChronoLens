import logo from "./logo.svg"
import "./App.css"
import TimesheetDescription from "./component/TimesheetDescription"
import type { MenuProps } from "antd"
import { Alert, Layout, Menu, Space, theme } from "antd"
import {
    GithubOutlined
} from "@ant-design/icons"

const { Header, Content, Footer, Sider } = Layout

function App() {
    return (
        <Layout className="App">
            <Header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />

                <h1>
                    Extract timesheet from file informations
                    <br />
                    <small>using Nova Pro on Bedrock</small>

                </h1>

                <div>&nbsp;</div>
            </Header>

            <Alert message="This project is a demonstration / proof-of-concept and is not intended for use in production environments. It is provided as-is, without warranty or guarantee of any kind. The code and any accompanying materials are for educational, testing, or evaluation purposes only." type="warning" />

            <Content className="App-Content">
                <div className="image-uploader">
                    <TimesheetDescription
                        apigateway="https://lbt12lad88.execute-api.us-west-2.amazonaws.com/beta/" />

                </div>

            </Content>
        </Layout>

    )

}

export default App
