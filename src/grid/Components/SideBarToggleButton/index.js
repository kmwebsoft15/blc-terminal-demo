import React from 'react';
import { withSafeTimeout } from '@hocs/safe-timers';
import { Wrapper, ToggleButton } from './components';

class SidebarToggleButton extends React.Component {
    state = { isShow: true };

    clearToggleSidebarShowTimeout = null;

    componentWillUnmount() {
        if (this.clearToggleSidebarShowTimeout) {
            this.clearToggleSidebarShowTimeout();
        }
    }

    toggleSidebarShow = (e) => {
        e.stopPropagation();
        const { sidebarStatus, setSidebarStatus, setSafeTimeout } = this.props;

        if (sidebarStatus === 'closed') {
            setSidebarStatus('open');
        } else {
            setSidebarStatus('closed');
        }

        this.setState({ isShow: false });

        this.clearToggleSidebarShowTimeout = setSafeTimeout(() => { this.setState({ isShow: true }); }, 1000);
    };

    render() {
        const { sidebarStatus, isMobileLandscape, screenHeight } = this.props;
        const { isShow } = this.state;

        return !isMobileLandscape && (
            <Wrapper
                isOpen={sidebarStatus === 'open'}
                isMobileLandscape={isMobileLandscape}
                onClick={this.toggleSidebarShow}
                screenHeight={screenHeight}
            >
                {isShow && <ToggleButton isOpen={sidebarStatus === 'open'}/>}
            </Wrapper>
        );
    }
}
export default withSafeTimeout(SidebarToggleButton);