import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import _ from 'lodash';

import { MODE_KEYS, MODE_LABELS, EXTRA_DROPMENU_LABELS } from './Constants';
import { HeaderMenu, Menu, DropMenuWrapper, ToolbarItem, IcFullScreen, IcExitFullScreen } from './Components';
import DropMenu from './DropMenu';
import { STORE_KEYS } from '@/stores';
import { getScreenInfo } from '@/utils';

const IS_MOBILE = getScreenInfo().isMobileDevice;

class HeaderMenuItems extends Component {
    state = {};
    render() {
        const {
            rightBottomSectionOpenMode,
            setRightBottomSectionOpenMode,
            rightBottomSectionFullScreenMode,
            setRightBottomSectionFullScreenMode,
            [STORE_KEYS.INSTRUMENTS]: instrumentsStore
        } = this.props;
        const instrumentData = ['All', instrumentsStore.selectedBase, instrumentsStore.selectedQuote];
        const statusData = ['All', 'Filled', 'Canceled', 'Rejected', 'Expired'];
        const tradeData = ['All', 'Yes', 'No'];
        const sourceData = ['All', 'FIX', 'WEB', 'REST', 'ADM'];

        return (
            <HeaderMenu>
                {Object.values(MODE_KEYS).map(key =>
                    <Menu
                        key={key}
                        active={rightBottomSectionOpenMode === key}
                        onClick={() => setRightBottomSectionOpenMode(key)}
                    >
                        {MODE_LABELS[key]}
                    </Menu>
                )}
                {
                    [
                        MODE_KEYS.activeModeKey,
                        MODE_KEYS.filledModeKey,
                        MODE_KEYS.myTradesModeKey,
                    ].includes(rightBottomSectionOpenMode) &&
                    !IS_MOBILE &&
                    <DropMenuWrapper>
                        <DropMenu data={instrumentData} label="Instrument" />
                        {EXTRA_DROPMENU_LABELS[rightBottomSectionOpenMode].map(label => <DropMenu key={label} data={statusData} label={label} />)}
                    </DropMenuWrapper>
                }
                {
                    ![MODE_KEYS.depthChartKey].includes(rightBottomSectionOpenMode) &&
                    <ToolbarItem
                        onClick={() => setRightBottomSectionFullScreenMode(!rightBottomSectionFullScreenMode)}
                    >
                        {!rightBottomSectionFullScreenMode && <IcFullScreen />}
                        {rightBottomSectionFullScreenMode && <IcExitFullScreen />}
                    </ToolbarItem>
                }
            </HeaderMenu>
        );
    }
}

export default inject(
    STORE_KEYS.INSTRUMENTS,
)(observer(HeaderMenuItems));