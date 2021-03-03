import React, { Component } from 'react';
import styled from 'styled-components/macro';

import OrderHistory from 'components/ArbitrageHistory';
import DonutChart from 'components/GraphTool/DonutChart';
import SmartOrderRouter from "components/GraphTool/DonutChart/SmartOrderRouter";

const Wrapper = styled.div`
    display: flex;
    width: ${props => props.width}px;
    height: ${props => props.height}px;
    
    .left {
        position: relative;
        flex: 1;
        height: 100%;
        margin-right: 12px;
    }
    
    .right {
        flex: 1;
        height: 100%;
    }
`;

class ArbitrageDetail extends Component {
    componentDidMount() {

    }

    render() {
        const {
            width, height,
        } = this.props;

        return (
            <Wrapper
                width={width}
                height={height}
            >
                <div className="left">
                    <DonutChart
                        width={width / 2}
                        height={height}
                        isLoggedIn={true}
                        isExchangeCellsV2
                        donutChatId="donut-chart"
                    />
                    <SmartOrderRouter/>
                </div>
                <div className="right">
                    <OrderHistory />
                </div>
            </Wrapper>
        );
    }
}

export default ArbitrageDetail;
