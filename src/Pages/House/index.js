import React from 'react';
import {Button, Card, Col, Row, Layout} from "antd";

class House extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    column = [{
        title: ''
    }]

    render() {
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Row>
                    <Col span={8}></Col>
                    <Col span={8}></Col>
                    <Col span={8}><Button type={"primary"}>查询</Button></Col>
                </Row>
            </Layout>
        )
    }
}

export default House;