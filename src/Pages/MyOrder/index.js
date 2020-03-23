import React, {Component} from 'react';
import {sendRequest} from "../../NetRequest/api";
import {Button, Card, Cascader, Drawer, Form, Input, Layout, message, Popconfirm, Table} from "antd";
import Area from "../area";

class MyOrder extends React.Component {

    column = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '目的地',
            dataIndex: 'to',
            key: 'to'
        }, {
            title: '货物名称',
            dataIndex: 'goodsName',
            key: 'goodsName'
        }, {
            title: '货物重量',
            dataIndex: 'goodsWeight',
            key: 'goodsWeight'
        }, {
            title: '货物状态',
            dataIndex: 'status',
            key: 'status'
        }, {
            title: '预估价格',
            dataIndex: 'price',
            key: 'price'
        }, {
            title: '司机',
            dataIndex: 'driverName',
            key: 'driverName'
        }, {
            title: '车辆',
            dataIndex: 'carNumber',
            key: 'carNumber'
        }, {
            title: '时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        }
    ]

    state = {
        orderData: [],
        tableIndex: 0,
        drawerVisible: false
    }

    componentDidMount() {
        this.queryOrder()
    }

    queryOrder = () => {
        sendRequest('/order/getMyOrder').then(r => {
            this.setState({
                orderData: r.data,
                tableIndex: this.state.tableIndex + 1
            })
        })
    }

    changeDrawerVisible = () => {
        this.setState({
            drawerVisible: !this.state.drawerVisible,
        });
    };


    render() {
        const {orderData, tableIndex, drawerVisible} = this.state
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Button type="link" onClick={this.changeDrawerVisible}>下单</Button>
                <Table columns={this.column} pagination={false} dataSource={orderData}
                       rowKey={tableIndex} key={tableIndex}/>
                <OrderDrawer onClose={this.changeDrawerVisible} drawerVisible={drawerVisible}
                             queryOrder={this.queryOrder}/>
            </Layout>
        )
    }
}

export default MyOrder

const OrderDrawer = Form.create()(
    class extends Component {
        formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };

        handleSubmit = (e) => {
            e.preventDefault();
            const {form, onClose, queryOrder} = this.props;
            form.validateFields((err, values) => {
                if (!err) {
                    values.to = values.to.join('-');
                    sendRequest('/order/addOrder', 'post', values).then(data => {
                        if (data.code === '0') {
                            queryOrder()
                            onClose();
                            form.resetFields();
                            message.info("提交成功")
                        } else {
                            message.info("修改失败")
                        }
                    })
                }
            })
        };

        onClose = () => {
            this.props.onClose()
            this.props.form.resetFields()
        }

        render() {
            const {getFieldDecorator} = this.props.form;
            const {drawerVisible} = this.props;
            return (
                <Drawer title="个人信息" placement="right" onClose={this.onClose} width={720}
                        visible={drawerVisible}>
                    <Form {...this.formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label={'目的地址：'}>
                            {getFieldDecorator('to', {
                                initialValue: [],
                                rules: [{required: true, message: '请选择地址!'}],
                            })
                            (<Area style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'货物名称：'}>
                            {getFieldDecorator('goodsName', {
                                rules: [{required: true, message: '此项不能为空！'}]
                            })
                            (<Input style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'重量：'}>
                            {getFieldDecorator('goodsWeight', {rules: [{required: true, message: '此项不能为空！'}]})
                            (<Input placeholder="goodsWeight" style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'体积：'}>
                            {getFieldDecorator('goodsCapacity', {rules: [{required: true, message: '此项不能为空！'}]})
                            (<Input placeholder="goodsCapacity" style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item>
                            <Button type='primary' htmlType={"submit"} style={{marginLeft: '40%'}}>提交</Button>
                        </Form.Item>
                    </Form>
                </Drawer>
            )
        }
    }
);