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
            modalVisible: false,
            tableIndex: 0
        }
    }

    column = [
        {
            title: '司机id',
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
            title: '电话',
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
        },{
            title: '创建时间',
            dataIndex: 'updateTime',
            key: 'updateTime'
        }, {
            title: '操作',
            key: 'operation',
            render: (text, record) => (
                <Popconfirm title="Sure to delete?" onConfirm={() => this.handleDelete(record.id)}>
                    <a>Delete</a>
                </Popconfirm>)
        }
    ]

    componentDidMount() {
        this.query()
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {carLoading, data, modalVisible, tableIndex} = this.state;
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
                                    <Button type="primary" onClick={this.changeModalVisible}>
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
                <Modal title={'添加新车辆'} visible={modalVisible} onCancel={this.changeModalVisible}
                       onOk={this.handleModalSubmit} okText={'添加'} cancelText={'取消'}
                >
                    <ModaForm wrappedComponentRef={(ref) => {
                        this.formRef = ref
                    }}/>
                </Modal>
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


    handleModalSubmit = () => {
        const {form} = this.formRef.props
        form.validateFields((err, values) => {
            if (!err) {
                sendRequest('/car/addCar', 'post', values).then((data) => {
                    if (data.code === '0') {
                        message.info('添加新车辆成功！！！')
                        this.changeModalVisible()
                        this.query()
                    } else {
                        message.error(data.message)
                    }
                })
            }
        })
    }

    changeModalVisible = () => {
        const modalVisible = !this.state.modalVisible
        this.setState({modalVisible})
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

        render() {
            const {getFieldDecorator} = this.props.form
            return (
                <Form {...this.formItemLayout} wrappedComponentRef={(form) => this.modalForm = form}>
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
            )
        }
    }
)