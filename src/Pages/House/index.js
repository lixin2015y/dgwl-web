import React, {Component} from 'react';
import {Button, Card, Col, Form, Input, InputNumber, Layout, message, Modal, Popconfirm, Row, Table} from "antd";
import {sendRequest} from "../../NetRequest/api";
import Area from "../area";

class House extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carLoading: true,
            addModalVisible: false,
            editModalVisible: false,
            tableIndex: 0,
            editRecord: {},
            orderViewVisible: false,
            editHouseOrder: {},
            houseOrderData: []
        }
    }

    column = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '大仓名称',
            key: 'name',
            render: (text, record) => {
                return <Button type={"link"} onClick={() => {
                    this.show(record)
                }}>{record.name}</Button>
            }
        }, {
            title: '地址',
            dataIndex: 'address',
            key: 'address'
        }, {
            title: '占地面积',
            dataIndex: 'cover',
            key: 'cover'
        }, {
            title: '电话',
            dataIndex: 'tel',
            key: 'tel'
        }, {
            title: '建造时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <div>
                    <Button type={"link"} onClick={() => this.changeEditModalVisible(record)}>edit</Button>
                    <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                        <a>Delete</a>
                    </Popconfirm>
                </div>

            )
        }
    ]

    componentDidMount() {
        this.query()
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {
            carLoading, data, addModalVisible, tableIndex, editModalVisible, editRecord, orderViewVisible,
            editHouseOrder, houseOrderData
        } = this.state;
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Card style={{borderRadius: '10px', background: '#F7F7F7'}}>
                    <Row>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Col span={5}>
                                <Form.Item label={'大仓名称：'}>
                                    {getFieldDecorator('name', {initialValue: ''})
                                    (<Input placeholder="name"/>)}
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item label={'地址：'}>
                                    {getFieldDecorator('address', {initialValue: []})
                                    (<Area/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label={'占地面积：'}>
                                    {getFieldDecorator('cover', {initialValue: 0})
                                    (<InputNumber/>)}
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                </Form.Item>
                            </Col>
                            <Col span={3}>
                                <Form.Item>
                                    <Button type="primary" onClick={this.changeAddModalVisible}>
                                        添加
                                    </Button>
                                </Form.Item>
                            </Col>
                        </Form>
                    </Row>
                </Card>
                <Row>
                    <div style={{marginTop: '20px', height: 'calc(100% - 280px)'}}>
                        <Table columns={this.column} bordered loading={carLoading} dataSource={data}
                               key={tableIndex} rowKey={record => record.id}/>
                    </div>
                </Row>
                <ModaForm onOk={this.handleAddModalSubmit} modalVisible={addModalVisible} operation={'添加'}
                          changeModalVisible={this.changeAddModalVisible}/>
                <ModaForm onOk={this.handleEditModalSubmit} modalVisible={editModalVisible} operation={'编辑'}
                          changeModalVisible={this.changeEditModalVisible} record={editRecord}/>

                <OrderView visible={orderViewVisible} changeModalVisible={this.changeShowVisible} data={houseOrderData}
                           record={editHouseOrder}/>
            </Layout>
        )
    }

    show = (record) => {
        this.queryHouseOrderData(record.id)
        this.setState({
            orderViewVisible: true
        })
    }

    changeShowVisible = () => {
        this.setState({
            orderViewVisible: !this.state.orderViewVisible
        })
    }


    handleDelete = (id) => {
        sendRequest('/house/deleteHouse', 'post', {
            id: id
        }).then(data => {
            if (data.code === '0') {
                message.info("删除成功！")
                this.query()
            }
        })
    }


    handleAddModalSubmit = (values) => {
        values.address = values.address.join('-')
        sendRequest('/house/addHouse', 'post', values).then((data) => {
            if (data.code === '0') {
                message.info('添加新车辆成功！！！')
                this.changeAddModalVisible()
                this.query()
            } else {
                message.error(data.message)
            }
        })
    }

    handleEditModalSubmit = (values) => {
        values.address = values.address.join('-')
        sendRequest('/house/editHouse', 'post', values).then((data) => {
            if (data.code === '0') {
                message.info('修改仓库信息成功！！！')
                this.changeEditModalVisible({})
                this.query()
            } else {
                message.error(data.message)
            }
        })
    }

    changeAddModalVisible = () => {
        const addModalVisible = !this.state.addModalVisible
        this.setState({addModalVisible})
    }

    changeEditModalVisible = (editRecord) => {
        const editModalVisible = !this.state.editModalVisible
        this.setState({editModalVisible, editRecord})
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.query()
    }

    query = () => {
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({
                    carLoading: true
                })
                sendRequest('/house/getHouse', 'post', {
                    name: values.name,
                    address: values.address.join('-'),
                    cover: values.cover
                }).then(data => {
                    this.setState({
                        data: data.data,
                        carLoading: false,
                        tableIndex: this.state.tableIndex + 1
                    })
                })
            }
        })
    }

    queryHouseOrderData = (id) => {
        sendRequest('/order/getOrderInHouse', 'post', {houseId: id})
            .then(r => r.data).then(
            data => {
                this.setState({
                    houseOrderData: data
                })
            }
        )
    }
}

export default House = Form.create()(House)

const ModaForm = Form.create({
    mapPropsToFields: (props => {
        return props.record !== undefined && Object.keys(props.record).length !== 0 ? {
            name: Form.createFormField({value: props.record.name}),
            address: Form.createFormField({value: props.record.address.split('-')}),
            cover: Form.createFormField({value: props.record.cover}),
            tel: Form.createFormField({value: props.record.tel})
        } : {}
    })
})(
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


        handleOk = () => {
            const {form, onOk} = this.props
            form.validateFields((err, values) => {
                if (!err) {
                    values = this.props.record ? {...{id: this.props.record.id}, ...values} : values
                    onOk(values)
                }
            })
        }

        handleCancel = () => {
            const {form, changeModalVisible} = this.props
            form.resetFields()
            changeModalVisible()
        }

        render() {
            const {modalVisible, operation} = this.props
            const {getFieldDecorator} = this.props.form
            return (
                <Modal title={`${operation}新仓库`} visible={modalVisible} onCancel={this.handleCancel}
                       onOk={this.handleOk} okText={'确定'} cancelText={'取消'} destroyOnClose
                >
                    <Form {...this.formItemLayout}>
                        <Form.Item label={'仓库名称：'}>
                            {getFieldDecorator('name', {rules: [{required: true, message: '此项不能为空！'}]})
                            (<Input placeholder="name" style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'地址：'}>
                            {getFieldDecorator('address', {
                                initialValue: [],
                                rules: [{required: true, message: '请选择地址!'}],
                            })
                            (<Area style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'占地面积：'}>
                            {getFieldDecorator('cover', {
                                initialValue: 5, rules: [{required: true, message: '此项不能为空！'}]
                            })
                            (<InputNumber/>)}
                        </Form.Item>
                        <Form.Item label={'电话：'}>
                            {getFieldDecorator('tel', {
                                initialValue: 5, rules: [{required: true, message: '此项不能为空!'}]
                            })
                            (<Input style={{width: '50%'}}/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)

class OrderView extends Component {


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
                    <Button type={"link"} onClick={() => {
                        this.handleOrder(record)
                    }}
                    >{record.status === '已发出' ? `入库` : `出库`}</Button>
                </div>

            )
        }
    ]

    handleOrder = (record) => {
        record.status = record.status === '已发出' ? `已入库` : `已完成`
        sendRequest('/order/handleOrder', 'post', record)
            .then(data => data.data).then(data => {
            this.setState({data})
        })
    }


    handleCancel = () => {
        const {changeModalVisible} = this.props
        changeModalVisible()
    }

    render() {
        const {visible, data} = this.props
        return (
            <Modal title={'订单处理'} visible={visible} onCancel={this.handleCancel} footer={false}
                   destroyOnClose width={'60%'}>
                <Table bordered columns={this.column} dataSource={data}/>
            </Modal>
        )
    }
}