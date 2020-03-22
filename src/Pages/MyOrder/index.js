import React from 'react';
import {sendRequest} from "../../NetRequest/api";
import {Button, Card, Cascader, Layout, Popconfirm, Table} from "antd";

class Area extends React.Component {

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
        }
    ]

    componentDidMount() {

    }

    render() {
        return (
            <Layout style={{height: '100%', width: '100%', overflow: 'inherit', background: '#fff'}}>
                <Table columns={this.column} pagination={false}/>
            </Layout>
        )
    }
}

export default Area