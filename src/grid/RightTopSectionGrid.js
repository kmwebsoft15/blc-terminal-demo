import React from 'react';
import styled from 'styled-components/macro';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '@/stores';
import { STATE_KEYS } from '@/stores/ConvertStore';
import { viewModeKeys } from '@/stores/ViewModeStore';
import { getScreenInfo } from '@/utils';
import CoinPairSearchV2 from '@/components/CoinPairSearchV2';
import ForexPairV1 from '@/components/ForexApp/ForexPairV1';
import GraphTool from '@/components/GraphTool';
import MarketMakerModal from '@/components/Modals/MarketMakerModal';
import BillsModal from '@/components/Modals/BillsModal';

const StyledRightTopSectionGrid = styled.div`
    position: relative;
    margin-left: 12px;
    ${props => (props.isMobilePortrait || props.isSmallWidth) ? 'display: none;' : 'flex: 1;'}
`;

const GraphGrid = styled.div`
    height: 100%;
    display: grid;
    grid-template-rows: ${props => !props.isAdvanced ? '100%' : '60px calc(100% - 72px)'};
    grid-gap: ${props => !props.isAdvanced ? '0' : '12px'};
    ${props => props.isAdvanced ? `
        grid-template-areas:
        "search"
        "chart";
    ` : `
        grid-template-areas:
        "chart";
    `}
`;

const SearchBarGridArea = styled.div`
    grid-area: search;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    min-width: 0;
    background-color: ${props => props.theme.palette.clrChartBackground};
    // ${props => (props.full) ? 'margin-left: -72px;' : ''}
    z-index: ${props => props.rightBottomSectionFullScreenMode ? '100' : '1000000'};
`;

const ChartGridArea = styled.div`
    grid-area: chart;
    position: relative;
    // ${props => (props.full) ? 'margin-left: -72px;' : ''}
`;

const IS_MOBILE = getScreenInfo().isMobileDevice;

class RightTopSectionGrid extends React.Component {
    componentDidMount() {
    }

    render() {
        const {
            tradeColStatus,
            isArbitrageMode,
            sidebarStatus,
            convertState,
            isMobilePortrait,
            isSmallWidth,
            isPayApp,
            viewMode,
            rightBottomSectionFullScreenMode,
            isMobileDevice,
        } = this.props;
        const isArbitrageMonitorMode = isArbitrageMode && (convertState !== STATE_KEYS.coinSearch);
        const isAdvanced = convertState === STATE_KEYS.coinSearch && !IS_MOBILE;
        const isForexMode = viewMode === viewModeKeys.forexModeKey;

        return (!isPayApp || !isMobileDevice) && (
            <StyledRightTopSectionGrid isMobilePortrait={isMobilePortrait} isSmallWidth={isSmallWidth} id="right-top">
                <GraphGrid isAdvanced={isAdvanced}>
                    {isAdvanced && (
                        <SearchBarGridArea
                            full={(isArbitrageMonitorMode && tradeColStatus === 'closed') || sidebarStatus === 'closed'}
                            rightBottomSectionFullScreenMode={rightBottomSectionFullScreenMode}
                        >
                            {isForexMode ? (
                                <ForexPairV1 isSimple={false}/>
                            ) : (
                                <CoinPairSearchV2 isSimple={false}/>
                            )}
                        </SearchBarGridArea>
                    )}
                    <ChartGridArea id="graph" full={(isArbitrageMonitorMode && tradeColStatus === 'closed') || sidebarStatus === 'closed'}>
                        <GraphTool/>
                    </ChartGridArea>
                </GraphGrid>

                <BillsModal />

                <MarketMakerModal />
            </StyledRightTopSectionGrid>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.SETTINGSSTORE,
        STORE_KEYS.CONVERTSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: {
                isPayApp,
                viewMode,
                rightBottomSectionFullScreenMode,
            },
            [STORE_KEYS.SETTINGSSTORE]: {
                tradeColStatus,
                isArbitrageMode,
                sidebarStatus,
            },
            [STORE_KEYS.CONVERTSTORE]: {
                convertState,
            },
        }) => ({
            isPayApp,
            viewMode,
            rightBottomSectionFullScreenMode,
            tradeColStatus,
            isArbitrageMode,
            sidebarStatus,
            convertState,
        })
    )
);

export default withStore(RightTopSectionGrid);
