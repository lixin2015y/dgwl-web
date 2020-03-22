import React from 'react';
import {sendRequest} from "../../NetRequest/api";
import {Cascader} from "antd";

class Area extends React.Component {

    state = {
        option: []
    }

    componentDidMount() {
        sendRequest('/house/getArea').then(data => data.data).then(data => {
            this.setState({
                option: data
            })
        })
    }

    render() {
        const {onChange, value, style} = this.props
        return (
            <Cascader options={this.state.option} onChange={(value) => {onChange(value)}}
                      value={value} placeholder="选择" style={style}/>
        )
    }
}

export default Area