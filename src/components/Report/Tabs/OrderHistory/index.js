import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { orderHistoryDropdowns } from '../../constants';
import { STORE_KEYS } from '@/stores';

import TabHeader from '../../TabHeader';
import ReportTable from '../../Table';
import { checkDateIsBetweenTwo } from '../..';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    text-align: center;
`;

class OrderHistory extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isExchBarOpen: false,
            startDate: undefined,
            endDate: undefined,
        };
    }

    changeStartDate = (date) => {
        this.setState({
            startDate: date,
        });
    }

    changeEndDate = (date) => {
        this.setState({
            endDate: date,
        });
    }

    render() {
        const orderHistoryColumns = this.props.OrderHistoryData;
        let filteredColumns = [];
        const { startDate, endDate } = this.state;
        for (let i = 0; i < orderHistoryColumns.length; i++) {
            let ithDate = new Date(orderHistoryColumns[i].timeUnFormatted);
            if (checkDateIsBetweenTwo(ithDate, startDate, endDate) === true) {
                filteredColumns.push(orderHistoryColumns[i]);
            }
        }
        return (
            <Wrapper>
                <TabHeader
                    tab="orderHistory"
                    changeStartDate={this.changeStartDate}
                    changeEndDate={this.changeEndDate}
                    dropdowns={orderHistoryDropdowns}
                >
                </TabHeader>
                <ReportTable columns={filteredColumns}/>
            </Wrapper>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.ORDERHISTORY
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.ORDERHISTORY]: { OrderHistoryData },
        }) => ({ OrderHistoryData })
    )
)(OrderHistory);
