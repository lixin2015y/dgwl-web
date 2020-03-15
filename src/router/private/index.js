import React from 'react'
import {Route, Redirect} from 'react-router-dom'
import {message} from "antd";
import {sendRequest} from "../../NetRequest/api";

const PrivateRoute = ({component: Component, ...props}) => {
    return <Route {...props} render={(p) => {
        const login = sessionStorage.getItem('sessionId') != null
        if (login) {
            return <Component/>
        } else {
            message.info("您已退出登录！！！")
            return <Redirect to={{
                pathname: '/login'
            }}/>
        }
    }}/>
}
export default PrivateRoute