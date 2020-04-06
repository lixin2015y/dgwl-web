import React from 'react'
import {Link} from 'react-router-dom'
import {Card, Form, Icon, Checkbox, Button, Input, message, Col, Row, Select, Modal} from 'antd'
import './index.css'
import {sendRequest} from "../../NetRequest/api";

const FormItem = Form.Item;
const Option = Select.Option
const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 8},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 16},
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 24,
            offset: 0,
        },
        sm: {
            span: 16,
            offset: 8,
        },
    },
};

class RegisterPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()
        this.props.form.validateFields((error, value) => {
            if (!error) {
                if (value.comfirm !== value.password) {
                    message.error('两次输入密码不正确')
                    return
                }

                sendRequest('/user/reg', 'post', {
                    userName: value.userName,
                    password: value.password
                }).then(r => {
                        if (r.code ==='0'){
                            window.location.pathname = '/login'
                        }else{
                            message.error(r.message)
                        }
                    }
                )
            }
        })
    }

    checkIsTrue = (rule, value, callback) => {
        if (!value) {
            callback('Checking means that you agree to the terms of use of this site.');
        } else {
            callback();
        }
    }

    handleShow = (e) => {
        e.preventDefault();
        this.setState({
            visible: true
        })
    }

    handleOk = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    handleCancel = (e) => {
        console.log(e);
        this.setState({
            visible: false,
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;

        return (
            <div className='container'>
                <Card style={{width: 450, height: 520}} className='login-card'>
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem
                            {...formItemLayout}
                            label="user Name"
                        >
                            {getFieldDecorator('userName', {
                                rules: [{required: true, message: 'Please input your username!'}],
                            })(
                                <Input prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}
                                       placeholder="Username"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="password"
                        >
                            {getFieldDecorator('password', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="Password"/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="comfirm password"
                        >
                            {getFieldDecorator('comfirm', {
                                rules: [{required: true, message: 'Please input your Password!'}],
                            })(
                                <Input prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>} type="password"
                                       placeholder="Password"/>
                            )}
                        </FormItem>
                        <FormItem {...tailFormItemLayout}>
                            {getFieldDecorator('agreement', {
                                valuePropName: 'checked',
                                rules: [{
                                    validator: this.checkIsTrue
                                }]
                            })(
                                <Checkbox>I have read the <i href="#" onClick={this.handleShow}
                                                             style={{color: 'green'}}>agreement</i></Checkbox>
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
                                Register
                            </Button>
                            Already have an account ? <Link to='/login'> Login in! </Link>
                        </FormItem>
                    </Form>
                </Card>

                {
                    this.state.visible ?
                        <Modal
                            title="Terms of Service"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                        >
                            <h1>你同意啦！！！</h1>
                        </Modal>
                        : ""
                }
            </div>
        )
    }
}

export default Form.create()(RegisterPage)