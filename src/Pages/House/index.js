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
import Area from "../area";

class House extends React.Component {
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
            title: 'id',
            dataIndex: 'id',
            key: 'id'
        }, {
            title: '大仓名称',
            dataIndex: 'name',
            key: 'name'
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
        const {carLoading, data, addModalVisible, tableIndex, editModalVisible, editRecord} = this.state;
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
            </Layout>
        )
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