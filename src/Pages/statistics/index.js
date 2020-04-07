import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import 'echarts/lib/chart/pie'
import {Col, Row} from "antd";
import {sendRequest} from "../../NetRequest/api";

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {

        sendRequest('/order/getOrderCount', 'post')
            .then(r => {
                let keys = []
                let values = []
                let objData = []
                r.data.forEach(v => {
                    keys.push(v.month)
                    values.push(v.count)
                    objData.push({
                        value: v.count, name: v.month
                    })
                })

                let myChart1 = echarts.init(document.getElementById('item1'));
                myChart1.setOption({
                    title: {
                        text: 'ECharts 入门示例'
                    },
                    tooltip: {},
                    xAxis: {
                        data: keys
                    },
                    yAxis: {},
                    series: [{
                        name: '销量',
                        type: 'bar',
                        data: values
                    }]
                });

                let myChart2 = echarts.init(document.getElementById('item2'));
                myChart2.setOption({
                    series: [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius: '55%',
                            center: ['50%', '60%'],
                            data: objData,
                            emphasis: {
                                itemStyle: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                })

                let myChart3 = echarts.init(document.getElementById('item3'));
                myChart3.setOption({
                    xAxis: {
                        type: 'category',
                        data: keys
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: values,
                        type: 'line'
                    }]
                })
            })


    }

    render() {


        return (
            <Row>
                <Col span={8}>
                    <div id="item1" style={{width: '100%', height: 400}}></div>
                </Col>
                <Col span={8}>
                    <div id="item2" style={{width: '100%', height: 400}}>aasdasd</div>
                </Col>
                <Col span={8}>
                    <div id="item3" style={{width: '100%', height: 400}}>aasdasd</div>
                </Col>
            </Row>
        )
    }
}

export default Statistics;