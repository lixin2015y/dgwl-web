import React from 'react';
import {Button, Card, Col, Form, Input, InputNumber, Layout, Row, Select, Table} from "antd";
import {sendRequest} from "../../NetRequest/api";

const {Option} = Select;

class Car extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    column = [
        {
            title: '车辆id',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '车牌号',
            dataIndex: 'number',
            key: 'number'
        }, {
            title: '承载量(吨)',
            dataIndex: 'load',
            key: 'load'
        }, {
            title: '车辆类型',
            dataIndex: 'type',
            key: 'type'
        }, {
            title: '容积(立方米)',
            dataIndex: 'capacity',
            key: 'capacity'
        }
    ]

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Card style={{borderRadius: '10px', background: '#F7F7F7'}}>
                    <Row>
                        <Form layout="inline" onSubmit={this.handleSubmit} >
                            <Col span={5}>
                                <Form.Item label={'车牌号：'}>
                                    {getFieldDecorator('number', {initialValue: ''})
                                    (<Input placeholder="number"/>)}
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label={'类型：'}>
                                    {getFieldDecorator('type', {initialValue: ''})
                                    (<Select style={{width: '100px'}}>
                                        <Option value="小型车">小型车</Option>
                                        <Option value="中型车">中型车</Option>
                                        <Option value="大型车">大型车</Option>
                                        <Option value="">全部</Option>
                                    </Select>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label={'承载吨数以上：'}>
                                    {getFieldDecorator('load', {initialValue: 0})
                                    (<InputNumber/>)}
                                </Form.Item>
                            </Col>
                            <Col span={3}><Form.Item>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                            </Form.Item></Col>
                        </Form>
                    </Row>
                </Card>
                <Row>
                    <div style={{marginTop: '20px', height: 'calc(100% - 280px)'}}>
                        <Table columns={this.column} bordered/>
                    </div>
                </Row>

            </Layout>
        )
    }

    handleSubmit = () => {
        sendRequest('/car/getCars').then(r => {

        })

    }
}

export default Car = Form.create()(Car)