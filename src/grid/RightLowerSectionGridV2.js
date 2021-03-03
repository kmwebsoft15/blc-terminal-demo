import React, { Fragment } from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../stores';
import DataLoader from '../components-generic/DataLoader';
import PriceChartCanvas from "components/GraphTool/PriceChartCanvas";
import rotationIcon from "components/Modals/icons/rotation.png";
import { STATE_KEYS } from '@/stores/ConvertStore';
import PortfolioChartCanvas from "components/GraphTool/PortfolioChartCanvas";
import DepthChart from "components/DepthChart";
import TradingView from "components/GraphTool/TradingView";
import ActiveStatusCircle from "components/ArbitrageHistory/ActiveStatusCircle";
import { animateButton } from '../utils/CustomControls';

const StyledRightLowerSectionGrid = styled.div`
    position: absolute;
    bottom: 0;
    z-index: 100;
    width: 100%;
    height: ${props => props.height}px;
    margin-top: ${props => props.hasMargin ? '12px' : '0'};
    display: flex;
    flex-direction: column;
    border: 1px solid ${props => props.theme.palette.clrBorder};
    border-radius: ${props => props.theme.palette.borderRadius};
`;

export const ButtonRotate = styled.div.attrs({ className: 'change-deposit' })`
    position: absolute;
    right: 2px;
    bottom: 2px;
    z-index: 100010;
    width: 50px;
    height: 40px;
    background: transparent url('${rotationIcon}') center no-repeat;
    background-size: 100% auto;
    border: 4px solid transparent;
    color: ${props => props.theme.palette.clrHighContrast};
    cursor: pointer;
    &:hover {
        transition-duration: 0.3s;
        transform: scale(1.2);
    }
`;

class RightLowerSectionGridV2 extends React.Component {
    state = {};

    showArbDetails = () => {
        const {
            [STORE_KEYS.VIEWMODESTORE]: { setArbDetailMode, isArbDetailMode },
        } = this.props;
        setArbDetailMode(!isArbDetailMode);
    };

    render() {
        const {
            [STORE_KEYS.CONVERTSTORE]: { convertState },
            [STORE_KEYS.VIEWMODESTORE]: viewModeStore,
            [STORE_KEYS.ORDERBOOK]: orderBookStore,
            height,
            hasMargin,
            width,
        } = this.props;

        const {
            depthChartMode, isArbDetailMode, tradingViewMode, arbMode,
        } = viewModeStore;

        const {
            isDGLoaded,
            isSymbolUpdated,
            baseSymbol,
            quoteSymbol,
        } = orderBookStore;

        let showDepthChart = depthChartMode && isSymbolUpdated && isDGLoaded;

        return (
            <StyledRightLowerSectionGrid
                id="rightLowerSectionGrid"
                height={height}
                hasMargin={hasMargin}
            >
                {isArbDetailMode ? (
                    <Fragment>
                        {depthChartMode && !showDepthChart && (
                            <DataLoader/>
                        )}
                        <DepthChart />
                        <ActiveStatusCircle/>
                    </Fragment>
                ) : (!tradingViewMode ? (
                        <Fragment>
                            <PortfolioChartCanvas noBorder={true}/>
                            <PriceChartCanvas noBorder={true} isArbitrageMode={arbMode}/>
                            <ActiveStatusCircle isGraph/>
                        </Fragment>
                    ) : (
                        <TradingView
                            width={width}
                            height={height}
                            convertState={convertState}
                            coinPair={baseSymbol ? `${baseSymbol}-${quoteSymbol}` : 'BTC-USDT'}
                        />
                    )
                )}

                <ButtonRotate
                    id="arbDetails"
                    onClick={() => {
                        animateButton('arbDetails');
                        this.showArbDetails();
                    }}
                />
            </StyledRightLowerSectionGrid>
        );
    }
}

export default inject(
    STORE_KEYS.VIEWMODESTORE,
    STORE_KEYS.ORDERBOOK,
    STORE_KEYS.ORDERHISTORY,
    STORE_KEYS.SETTINGSSTORE,
    STORE_KEYS.CONVERTSTORE,
)(observer(RightLowerSectionGridV2));
