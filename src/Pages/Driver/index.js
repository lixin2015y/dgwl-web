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

class Driver extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            carLoading: true,
            addModalVisible: false,
            editModalVisible: false,
            tableIndex: 0,
            editRecord: {},
            carData: []
        }
    }

    column = [
        {
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '姓名',
            dataIndex: 'name',
            key: 'name'
        }, {
            title: '年龄',
            dataIndex: 'age',
            key: 'age'
        }, {
            title: '电话号码',
            dataIndex: 'tel',
            key: 'tel'
        }, {
            title: '身份证号',
            dataIndex: 'cardId',
            key: 'cardId'
        }, {
            title: '驾龄',
            dataIndex: 'driveAge',
            key: 'driveAge'
        }, {
            title: '入职时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        }, {
            title: '配车',
            dataIndex: 'hasCar',
            key: 'hasCar'
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
        const {carLoading, data, addModalVisible, tableIndex, editModalVisible, editRecord, carData} = this.state;
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Card style={{borderRadius: '10px', background: '#F7F7F7'}}>
                    <Row>
                        <Form layout="inline" onSubmit={this.handleSubmit}>
                            <Col span={5}>
                                <Form.Item label={'姓名：'}>
                                    {getFieldDecorator('name', {initialValue: ''})
                                    (<Input placeholder="name"/>)}
                                </Form.Item>
                            </Col>
                            <Col span={4}>
                                <Form.Item label={'驾龄：'}>
                                    {getFieldDecorator('driveAge', {initialValue: 0})
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
                        <Table columns={this.column} loading={carLoading} dataSource={data}
                               key={tableIndex} rowKey={record => record.id}/>
                    </div>
                </Row>
                <ModaForm onOk={this.handleAddModalSubmit} modalVisible={addModalVisible} operation={'添加'}
                          changeModalVisible={this.changeAddModalVisible} carData={carData}/>
                <ModaForm onOk={this.handleEditModalSubmit} modalVisible={editModalVisible} operation={'编辑'}
                          changeModalVisible={this.changeEditModalVisible} carData={carData} record={editRecord}/>
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
        sendRequest('/driver/addDriver', 'post', values).then((data) => {
            if (data.code === '0') {
                message.info('添加新司机成功！！！')
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
                sendRequest('/driver/getDrivers', 'post', {
                    name: values.name,
                    driveAge: values.driveAge
                }).then(data => {
                    this.setState({
                        data: data.data.driverData,
                        carData: data.data.carData,
                        carLoading: false,
                        tableIndex: this.state.tableIndex + 1
                    })
                })
            }
        })
    }
}

export default Driver = Form.create()(Driver)

const ModaForm = Form.create({
    // mapPropsToFields: (props => {
    //     return props.record ? {
    //         number: Form.createFormField({value: props.record.number}),
    //         type: Form.createFormField({value: props.record.type}),
    //         load: Form.createFormField({value: props.record.load}),
    //         capacity: Form.createFormField({value: props.record.capacity})
    //     } : {}
    // })
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
            const {modalVisible, operation, carData} = this.props
            const {getFieldDecorator} = this.props.form
            return (
                <Modal title={`${operation}司机`} visible={modalVisible} onCancel={this.handleCancel}
                       onOk={this.handleOk} okText={`${operation}`} cancelText={'取消'} destroyOnClose
                >
                    <Form {...this.formItemLayout}>
                        <Form.Item label={'姓名：'}>
                            {getFieldDecorator('name', {rules: [{required: true, message: '此项不能为空！'}]})
                            (<Input placeholder="name" style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'年龄：'}>
                            {getFieldDecorator('age', {
                                initialValue: 18, rules: [{required: true, message: '此项不能为空！'}]
                            })
                            (<InputNumber/>)}
                        </Form.Item>
                        <Form.Item label={'电话号码：'}>
                            {getFieldDecorator('tel', {
                                initialValue: 5, rules: [{required: true, message: '此项不能为空!'}]
                            })
                            (<Input/>)}
                        </Form.Item>
                        <Form.Item label={'身份证号：'}>
                            {getFieldDecorator('cardId', {
                                initialValue: 5, rules: [{required: true, message: '此项不能为空!'}]
                            })
                            (<Input placeholder="身份证号" style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'驾龄：'}>
                            {getFieldDecorator('driveAge', {
                                initialValue: 5, rules: [{required: true, message: '此项不能为空!'}]
                            })
                            (<InputNumber/>)}
                        </Form.Item>
                        <Form.Item label={'配车：'}>
                            {getFieldDecorator('carId', {
                                initialValue: 0,
                                rules: [{required: true, message: '配车!'}],
                            })
                            (<Select style={{width: '100px'}}>
                                <Option value={0}>暂不配车</Option>
                                {
                                    carData.map((car) => {
                                        return (<Option value={car.id} key={car.id}>{car.number}</Option>)
                                    })
                                }
                            </Select>)}
                        </Form.Item>
                    </Form>
                </Modal>
            )
        }
    }
)