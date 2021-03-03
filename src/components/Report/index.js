import React from 'react';
import styled from 'styled-components/macro';

import Header from './Header';
import OrderHistoryTab from './Tabs/OrderHistory';
import TradeHistoryTab from './Tabs/TradeHistory';
import GbxUtilizationHistoryTab from './Tabs/GbxUtilizationHistory';
import PaymentHistoryTab from './Tabs/PaymentHistory';
import NavReportTab from './Tabs/NavReport';

const Wrapper = styled.div`
    width: 100%;
    height: 100%;
    background-color: ${props => props.theme.palette.clrBackground};
    font-weight: 700;
    font-family: 'open_sans',sans-serif;
    border: 1px solid #454c73;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
`;

const TabContent = styled.div`
    display: flex;
    background-color: ${props => props.theme.palette.clrMainWindow};
    position: relative;
    border: 1px solid #454c73;
    height: 100%;
    flex-grow: 1;
`;

export const checkDateIsBetweenTwo = (date, startDate, endDate) => {
    let result = true;
    if (startDate === undefined && endDate === undefined) {
        result = true;
    } else if (startDate === undefined && endDate !== undefined) {
        if (date < endDate) {
            result = true;
        } else {
            result = false;
        }
    } else if (startDate !== undefined && endDate === undefined) {
        endDate = new Date();
        if (date > startDate && date < endDate) {
            result = true;
        } else {
            result = false;
        }
    } else if (date > startDate && date < endDate) {
        result = true;
    } else {
        result = false;
    }
    return result;
};

class Report extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTabIndex: 0,
        };
    }

    handleTabChange = (tabIndex) => {
        this.setState({
            activeTabIndex: tabIndex,
        });
    };

    render() {
        const { activeTabIndex } = this.state;

        return (
            <Wrapper>
                <Header
                    activeTabIndex={activeTabIndex}
                    onTabChange={this.handleTabChange}
                />
                <TabContent>
                    { activeTabIndex === 0 && <OrderHistoryTab/> }
                    { activeTabIndex === 1 && <TradeHistoryTab/> }
                    { activeTabIndex === 2 && <GbxUtilizationHistoryTab/> }
                    { activeTabIndex === 3 && <PaymentHistoryTab/> }
                    { activeTabIndex === 4 && <NavReportTab/> }
                </TabContent>
            </Wrapper>
        );
    }
}

export default Report;
