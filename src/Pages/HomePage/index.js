import React, {Component} from 'react';
import {Layout, Menu, Drawer, Icon, Dropdown, Form, Input, InputNumber, Button, message} from 'antd';
import {NavLink} from 'react-router-dom';
import menu from '../Menu'
import './index.css'
import '../../utils/image'
import imgArr from "../../utils/image";
import {sendRequest} from "../../NetRequest/api";
import Area from "../area";

const SubMenu = Menu.SubMenu;
const {Header, Content, Footer, Sider} = Layout;
export default class App extends React.Component {

    state = {
        user: {
            id: 1,
            address: '',
            phone: '',

            role: {
                id: 1,
                description: '管理员'
            }
        }
    };

    componentDidMount() {
        this.queryUser()
    }

    queryUser = () => {
        sendRequest('/user/getUser', 'post').then((data) => {
            const user = data.data;
            if (user === null) {
                window.location.pathname = '/login'
                return
            } else {
                this.setState({user},)
            }
        })
    };

    renderMenu = (menuList) => {
        return menuList.map((item) => {
            if (item.children) {
                return <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.name}</span></span>}>
                    {this.renderMenu(item.children)}
                </SubMenu>
            } else {
                return (
                    <Menu.Item key={item.key} onClick={this.handleClick}>
                        <NavLink to={item.path}>
                            <Icon type={item.icon}></Icon>
                            <span>{item.name}</span>
                        </NavLink>
                    </Menu.Item>
                )
            }
        })
    };

    clearData = () => {
        sessionStorage.removeItem('sessionId');
        window.location.pathname = '/login'
    };

    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    openDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };


    render() {


        // 用户下拉菜单
        const interfaceList = (
            <Menu>
                <Menu.Item onClick={this.openDrawer}>
                    <span><Icon type="user" style={{fontSize: 12}}/> &nbsp;
                        个人信息</span>
                </Menu.Item>
                <Menu.Item onClick={this.clearData}>
                    <span><Icon type="logout" style={{fontSize: 12}}/> &nbsp;
                        安全退出</span>
                </Menu.Item>
            </Menu>
        );

        const {user, drawerVisible} = this.state;
        return (
            <div>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider>
                        <div className="logo">
                            <img src={imgArr.log} alt="" width='170'/>
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            {this.renderMenu(user !== null && Object.keys(user).length !== 0 &&
                            user.role.id === 1 ? menu.systemMenu : menu.userMenu)}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{background: '#fff', padding: 0}}>
                            <Dropdown overlay={interfaceList}>
                                <h3 style={{color: '#f56a00', position: 'absolute', right: 100,}}>
                                    {user !== null && Object.keys(user).length !== 0 ? user.role.description + ':' + user.userName : ''}
                                </h3>
                            </Dropdown>
                        </Header>
                        <Content style={{margin: '20px 16px'}}>
                            <div style={{padding: 24, background: '#fff', minHeight: 360}}>
                                {this.props.children}
                            </div>
                        </Content>
                        <Footer style={{textAlign: 'center'}}>
                            Ant Design ©2018 Created by Ant UED
                        </Footer>
                    </Layout>
                </Layout>
                <UserDrawer onClose={this.onClose} drawerVisible={drawerVisible} user={user}/>
            </div>
        )
    }
}

const UserDrawer = Form.create(
    {
        mapPropsToFields: (props => {
            return Object.keys(props.user).length !== 0 ? {
                userName: Form.createFormField({value: props.user.userName}),
                address: Form.createFormField({value: props.user.address.split('-')}),
                phone: Form.createFormField({value: props.user.phone}),
                email: Form.createFormField({value: props.user.email}),
            } : {}
        })
    }
)(
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
            const {form, onClose} = this.props;
            form.validateFields((err, values) => {
                if (!err) {
                    values.address = values.address.join('-');
                    values = {...{id: this.props.user.id}, ...values};
                    sendRequest('/user/editUser', 'post', values).then(data => {
                        if (data.code === '0') {
                            onClose();
                            form.resetFields();
                            message.info("修改成功，信息会在下次登录时显示")
                        } else {
                            message.info("修改失败")
                        }
                    })
                }
            })
        };

        render() {
            const {getFieldDecorator} = this.props.form;
            const {onClose, drawerVisible} = this.props;
            return (
                <Drawer title="个人信息" placement="right" onClose={onClose} width={720}
                        visible={drawerVisible}>
                    <Form {...this.formItemLayout} onSubmit={this.handleSubmit}>
                        <Form.Item label={'用户名：'}>
                            {getFieldDecorator('userName', {rules: [{required: true, message: '此项不能为空！'}]})
                            (<Input placeholder="userName" style={{width: '50%'}} disabled/>)}
                        </Form.Item>
                        <Form.Item label={'地址：'}>
                            {getFieldDecorator('address', {
                                initialValue: [],
                                rules: [{required: true, message: '请选择地址!'}],
                            })
                            (<Area style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'电话号码：'}>
                            {getFieldDecorator('phone', {
                                rules: [{required: true, message: '此项不能为空！'}]
                            })
                            (<Input style={{width: '50%'}}/>)}
                        </Form.Item>
                        <Form.Item label={'邮箱：'}>
                            {getFieldDecorator('email', {rules: [{required: true, message: '此项不能为空！'}]})
                            (<Input placeholder="email" style={{width: '50%'}}/>)}
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