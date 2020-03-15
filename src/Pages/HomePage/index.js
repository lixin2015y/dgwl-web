import React from 'react';
import {Layout, Menu, Breadcrumb, Icon, Avatar, Dropdown} from 'antd';
import {NavLink, Link} from 'react-router-dom';
import systemMenu from '../Menu'
import './index.css'
import '../../utils/image'
import imgArr from "../../utils/image";
import {sendRequest} from "../../NetRequest/api";

const SubMenu = Menu.SubMenu;
const {Header, Content, Footer, Sider} = Layout;
export default class App extends React.Component {

    componentDidMount() {
        sendRequest('/user/getUser', 'post').then((data) => {
            if (data.data == null) {
                window.location.pathname = '/login'
            }
        })
    }

    renderMenu = (menuList) => {
        return menuList.map((item, index) => {
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
    }

    clearData=()=>{
        sessionStorage.removeItem('sessionId')
        window.location.pathname= '/login'
    }

    render() {

        // 用户下拉菜单
        const interfaceList = (
            <Menu>
                <Menu.Item onClick={this.clearData}>
                    <span><Icon type="logout" style={{fontSize: 12}}/> &nbsp;
                        <e>安全退出</e></span>
                </Menu.Item>
            </Menu>
        )

        return (
            <div>
                <Layout style={{minHeight: '100vh'}}>
                    <Sider>
                        <div className="logo">
                            <img src={imgArr.log} alt="" width='170'/>
                        </div>
                        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                            {this.renderMenu(systemMenu)}
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header style={{background: '#fff', padding: 0}}>
                            <Dropdown overlay={interfaceList}>
                                <Avatar style={{
                                    color: '#f56a00', backgroundColor: '#6eb0fd',
                                    position: 'absolute', right: 100, top: 10
                                }} icon="user"/>
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
            </div>
        )
    }
}