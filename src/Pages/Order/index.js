import React, {Component} from 'react';
import {sendRequest} from "../../NetRequest/api";
import {Button, Form, Input, InputNumber, Layout, message, Modal, Select, Table} from "antd";

const {Option} = Select

class Order extends React.Component {

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
            title: '货物体积',
            dataIndex: 'goodsCapacity',
            key: 'goodsCapacity'
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
            title: '传输方式',
            dataIndex: 'method',
            key: 'method'
        }, {
            title: '客户姓名',
            dataIndex: 'userName',
            key: 'userName'
        }, {
            title: '时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <div>
                    <Button type={"link"} disabled={record.status !== '待发货'}
                            onClick={() => this.setState({editOrder: record, modalVisible: true})}>发货</Button>
                    <Button type={"link"} onClick={() => this.deleteOrder(record)}>删除</Button>
                </div>
            )
        }
    ]

    state = {
        orderData: [],
        tableIndex: 0,
        editOrder: {},
        modalVisible: false
    }

    componentDidMount() {
        this.queryOrder()
    }

    queryOrder = () => {
        sendRequest('/order/getAllOrder').then(r => {
            this.setState({
                orderData: r.data,
                tableIndex: this.state.tableIndex + 1
            })
        })
    }

    deleteOrder = (record) => {
        sendRequest('/order/deleteOrder', 'post', {id: record.id}).then(r => {
            if (r.code === '0') {
                message.info('删除成功')
                this.queryOrder()
            }
        })
    }


    changeModalVisible = () => {
        this.setState({
            modalVisible: !this.state.modalVisible
        })
    }

    handleSubmit = (value) => {
        sendRequest('/order/deliverGoods', 'post', value).then(() => {
            this.queryOrder()
            this.changeModalVisible()
        })
    }

    render() {
        const {orderData, tableIndex, modalVisible, editOrder} = this.state
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Table columns={this.column} pagination={false} dataSource={orderData}
                       rowKey={tableIndex} key={tableIndex}/>
                <ModaForm onOk={this.handleSubmit} modalVisible={modalVisible}
                          changeModalVisible={this.changeModalVisible} record={editOrder}/>
            </Layout>
        )
    }
}

export default Order


const ModaForm = Form.create()(
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
        }


        state = {
            houseData: [],
            driverData: []
        }

        componentDidMount() {
            sendRequest('/order/getDriversAndHouse').then(data => {
                this.setState({
                    driverData: data.data.driverData,
                    houseData: data.data.houseData
                })
            })
        }


        handleOk = () => {
            const {form, onOk, record} = this.props
            form.validateFields((err, values) => {
                if (!err) {
                    onOk({...{id: record.id}, ...values})
                    sendRequest('/order/getDriversAndHouse').then(data => {
                        this.setState({
                            driverData: data.data.driverData,
                            houseData: data.data.houseData
                        })
                    })
                }
            })
        }

        handleCancel = () => {
            const {form, changeModalVisible} = this.props
            form.resetFields()
            changeModalVisible()
        }

        render() {
            const {modalVisible} = this.props
            const {getFieldDecorator} = this.props.form
            const {driverData, houseData} = this.state
            return (
                <Modal title={`组配`} visible={modalVisible} onCancel={this.handleCancel}
                       onOk={this.handleOk} okText={'确定'} cancelText={'取消'} destroyOnClose
                >
                    <Form {...this.formItemLayout}>
                        <Form.Item label={'选择司机：'}>
                            {getFieldDecorator('driverId', {
                                rules: [{required: true, message: '请填写车类型!'}],
                            })
                            (<Select style={{width: '100px'}}>
                                {
                                    driverData.map((driver) => {
                                        return (<Option value={driver.id} key={driver.id}>{driver.name}</Option>)
                                    })
                                }
                            </Select>)}
                        </Form.Item>
                        <Form.Item label={'目的仓库：'}>
                            {getFieldDecorator('houseId', {
                                rules: [{required: true, message: '请填写仓库类型!'}],
                            })
                            (<Select style={{width: '100px'}}>
                                {
                                    houseData.map((house) => {
                                        return (<Option value={house.id} key={house.id}>{house.name}</Option>)
                                    })
                                }
                            </Select>)}
                        </Form.Item>
                        <Form.Item label={'运送方式：'}>
                            {getFieldDecorator('method', {
                                rules: [{required: true, message: '请填写仓库类型!'}],
                            })
                            (<Select style={{width: '100px'}}>
                                <Option value="派送">派送</Option>
                                <Option value="传送">传送</Option>
                            </Select>)}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)