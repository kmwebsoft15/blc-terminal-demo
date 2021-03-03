import React, { PureComponent, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '@/stores';
import { animateButton } from '@/utils/CustomControls';
import AppStoreControls from './AppStoreControls'
import { Wrapper, ThreeDotIcon } from './Components';

class DesktopHeader extends PureComponent {
    state = {
        showAppStoreMenu: false
    }

    toggleAppStoreMenu = open => e => {
        const {
            setAppStoreControlsOpen,
        } = this.props;
        this.setState({ showAppStoreMenu: open });
        setAppStoreControlsOpen(true);
    }

    render() {
        const { showAppStoreMenu } = this.state;
        const {
            isLoggedIn,
            toggleDropDown,
            isMenuOpened,
            isAppStoreControlsOpen,
            setAppStoreDropDownOpen,
        } = this.props;

        return (
            <Wrapper onMouseLeave={this.toggleAppStoreMenu(false)} isMenuOpened={isMenuOpened} isLoggedIn={isLoggedIn}>
                {isLoggedIn &&
                    <Fragment>
                        <ThreeDotIcon
                            id="threeDotIcon"
                            isMenuOpened={isMenuOpened}
                            onClick={(e) => {
                                animateButton('threeDotIcon');
                                toggleDropDown();
                                setAppStoreDropDownOpen(true);
                            }}
                            toggleAppStoreMenu={this.toggleAppStoreMenu}
                        />
                    </Fragment>
                }
                {
                    !isMenuOpened && showAppStoreMenu && isAppStoreControlsOpen &&
                    <AppStoreControls
                        isMenuOpened={isMenuOpened}
                    />
                }
            </Wrapper>
        );
    }
};

const withStore = compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: {
                isAppStoreControlsOpen,
                setAppStoreControlsOpen,
                setAppStoreDropDownOpen,
            }
        }) => ({
            isAppStoreControlsOpen,
            setAppStoreControlsOpen,
            setAppStoreDropDownOpen,
        })
    )
);

export default withStore(DesktopHeader);
