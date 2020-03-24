import React from 'react';
import echarts from 'echarts/lib/echarts';
import 'echarts/lib/chart/bar';
import 'echarts/lib/chart/line';
import {Col, Row} from "antd";

class Statistics extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        let myChart = echarts.init(document.getElementById('item1'));
        myChart.setOption({
            title: {
                text: 'ECharts 入门示例'
            },
            tooltip: {},
            xAxis: {
                data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
            },
            yAxis: {},
            series: [{
                name: '销量',
                type: 'bar',
                data: [5, 20, 36, 10, 10, 20]
            }]
        });

    }

    render() {


        return (
            <Row>
                <Col span={8}>
                    <div id="item1" style={{width: '100%', height: 400}}>aasdasd</div>
                </Col>
                <Col span={8}>
                    <div id="item2" style={{width: '100%'}}>aasdasd</div>
                </Col>
                <Col span={8}>
                    <div id="item3" style={{width: '100%'}}>aasdasd</div>
                </Col>
            </Row>
        )
    }
}

export default Statistics;