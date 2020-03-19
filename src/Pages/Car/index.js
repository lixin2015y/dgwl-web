import React, {Component} from 'react';
import {
    Button,
    Card,
    Col,
    Form,
    Input,
    InputNumber,
    Layout,
    message,
    Modal,
    Popconfirm,
    Row,
    Select,
    Table
} from "antd";
import {sendRequest} from "../../NetRequest/api";

const {Option} = Select;

class Car extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carLoading: true,
            addModalVisible: false,
            editModalVisible: false,
            tableIndex: 0,
            editRecord: {}
        }
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
        }, {
            title: '创建时间',
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
        const {carLoading, data, addModalVisible, tableIndex, editModalVisible, editRecord} = this.state;
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Card style={{borderRadius: '10px', background: '#F7F7F7'}}>
                    <Row>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
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
            </Layout>
        )
    }

    handleDelete = (id) => {
        sendRequest('/car/deleteCar', 'post', {
            id: id
        }).then(data => {
            if (data.code === '0') {
                message.info("删除成功！")
                this.query()
            }
        })
    }


    handleAddModalSubmit = (values) => {
        sendRequest('/car/addCar', 'post', values).then((data) => {
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
        sendRequest('/car/editCar', 'post', values).then((data) => {
            if (data.code === '0') {
                message.info('修改车辆成功！！！')
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
                sendRequest('/car/getCars', 'post', {
                    number: values.number,
                    type: values.type,
                    load: values.load
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
}

export default Car = Form.create()(Car)

const ModaForm = Form.create({
    mapPropsToFields: (props => {
        return props.record ? {
            number: Form.createFormField({value: props.record.number}),
            type: Form.createFormField({value: props.record.type}),
            load: Form.createFormField({value: props.record.load}),
            capacity: Form.createFormField({value: props.record.capacity})
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
                <Modal title={`${operation}新车辆`} visible={modalVisible} onCancel={this.handleCancel}
                       onOk={this.handleOk} okText={'确定'} cancelText={'取消'} destroyOnClose
                >
                    <Form {...this.formItemLayout}>
                        <Form.Item label={'车牌号：'}>
                            {getFieldDecorator('number', {rules: [{required: true, message: '此项不能为空！'}]})
                            (<Input placeholder="number" style={{width: '30%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'类型：'}>
                            {getFieldDecorator('type', {
                                initialValue: '小型车',
                                rules: [{required: true, message: '请填写车类型!'}],
                            })
                            (<Select style={{width: '100px'}}>
                                <Option value="小型车">小型车</Option>
                                <Option value="中型车">中型车</Option>
                                <Option value="大型车">大型车</Option>
                            </Select>)}
                        </Form.Item>
                        <Form.Item label={'承载吨数以上：'}>
                            {getFieldDecorator('load', {
                                initialValue: 5, rules: [{required: true, message: '此项不能为空！'}]
                            })
                            (<InputNumber/>)}
                        </Form.Item>
                        <Form.Item label={'容积(立方米)：'}>
                            {getFieldDecorator('capacity', {
                                initialValue: 5, rules: [{required: true, message: '此项不能为空!'}]
                            })
                            (<InputNumber/>)}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)