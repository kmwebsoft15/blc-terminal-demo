import React, { PureComponent, Fragment } from 'react';

import { Wrapper, InnerWrapper } from './Components';
import HeaderMenuItems from './HeaderMenuItems';
import ActiveTable from './ActiveTable';
import FilledTable from './FilledTable';
import MyTradesTable from './MyTradesTable';
import ColdStorage from '../ColdStorage';
import DepthChart from '../DepthChart';
import TradingViewAdv from '@/components/GraphTool/TradingViewAdv';
import Report from '@/components/Report';
import { MODE_KEYS } from './Constants';
import ActiveStatusCircle from "components/ArbitrageHistory/ActiveStatusCircle";

class OrderHistoryAdv extends PureComponent {
    getContent = () => {
        const { rightBottomSectionOpenMode, arbMode } = this.props;
        switch (rightBottomSectionOpenMode) {
            case MODE_KEYS.depthChartKey:
                return (
                    <Fragment>
                        <DepthChart />
                        {arbMode && <ActiveStatusCircle/>}
                    </Fragment>
                );
            case MODE_KEYS.activeModeKey:
                return <ActiveTable />;
            case MODE_KEYS.filledModeKey:
                return <FilledTable />;
            case MODE_KEYS.myTradesModeKey:
                return <MyTradesTable />;
            case MODE_KEYS.reportsModeKey:
                return <Report />;
            case MODE_KEYS.accountsModeKey:
                return <TradingViewAdv />;
            case MODE_KEYS.coldStorageModeKey:
                return <ColdStorage />;
            case MODE_KEYS.tradingViewModeKey:
                return null;
            case MODE_KEYS.arbitrageModeKey:
                return null;
            default:
                return null;
        }
    };

    render() {
        const {
            rightBottomSectionOpenMode,
            setRightBottomSectionOpenMode,
            rightBottomSectionFullScreenMode,
            setRightBottomSectionFullScreenMode
        } = this.props;
        return (
            <Wrapper>
                <HeaderMenuItems
                    rightBottomSectionOpenMode={rightBottomSectionOpenMode}
                    setRightBottomSectionOpenMode={setRightBottomSectionOpenMode}
                    rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}
                    setRightBottomSectionFullScreenMode={setRightBottomSectionFullScreenMode}
                />
                <InnerWrapper>{this.getContent()}</InnerWrapper>
            </Wrapper>
        );
    }
}

export default OrderHistoryAdv;
