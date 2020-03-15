import {Route, Switch, Redirect, Router} from 'react-router-dom';
import React from 'react';
import HomePage from '../Pages/HomePage'
import Statistics from '../Pages/statistics'
import {createBrowserHistory} from 'history'
import LoginPage from "../Pages/LoginPage";
import "../NetRequest/api"
import {sendRequest} from "../NetRequest/api";
import PrivateRoute from "./private";
import RegisterPage from "../Pages/RegisterPage";
import Car from "../Pages/Car";
import House from "../Pages/House";

export default class App extends React.Component {

    state = {
        isAuto: '',
        user: {}
    }


    render() {
        return (
            <Router history={createBrowserHistory()}>
                <Switch>
                    <PrivateRoute path='/system' component={() => {
                        return (
                            <HomePage>
                                <Switch>
                                    <PrivateRoute path="/system/statistics" component={Statistics}/>
                                    <PrivateRoute path="/system/car" component={Car}/>
                                    <PrivateRoute path="/system/driver" component={Statistics}/>
                                    <PrivateRoute path="/system/house" component={House}/>
                                </Switch>
                            </HomePage>
                        )
                    }}/>
                    <Route path='/' exact render={() => (
                        <Redirect to='/system'/>
                    )}/>
                    <Route path='/login' component={LoginPage}/>
                    <Route path='/register' component={RegisterPage} />
                    {/*<Route path='/forgotPwd' component={ForgotPassword} />*/}
                </Switch>
            </Router>
        )
    }
}