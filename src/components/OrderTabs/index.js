import React, { Component, Fragment } from 'react';
import { compose, withProps } from 'recompose';
import { withStyles } from '@material-ui/styles';
import { inject, observer } from 'mobx-react';

import { STORE_KEYS } from '../../stores';
// import { MarketIcon, MarketHistoryIcon } from './icons';
import {
    // ToggleBtn,
    FormHeader,
    TabsWrapper,
    // Tabs,
    // Tab,
    // MarketStatusItem,
    DropdownWrapper,
    SelectedItem,
    ArrowIcon,
    Dropdown,
    Item
} from './Components';
import ExchangesLabel from './ExchangesLabel';

const styles = (theme) => {
    return {
        tabsRoot: {
            minHeight: '42px',
            borderBottom: `1px solid ${theme.appTheme.palette.clrseparatorD}`,
        },
        tabsIndicator: {
            backgroundColor: `${theme.appTheme.palette.orderFormHeaderTabActiveBorder}`,
            height: '3px',
        },
    };
};

class OrderTabs extends Component {
    state = {
        tabIndice: [0, 1],
        isOpened: false,
        selectedTab: 0,
    };

    wrapperRef = [];

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.state.isOpened && this.wrapperRef && this.wrapperRef[this.state.selectedTab].contains && !this.wrapperRef[this.state.selectedTab].contains(event.target)) {
            this.setState({
                isOpened: false,
            });
        }
    };

    handleTabChange = (tabIndex, menuIndex, tab) => () => {
        let currentTabIndice = this.state.tabIndice;
        currentTabIndice[tabIndex] = menuIndex;
        this.setState({
            tabIndice: currentTabIndice,
            isOpened: false,
        });
        if (tab === 1) {
            this.props.setAdvancedAPIMode(false);
        } else {
            /** TBD */
        }
    };

    toggleDropdown = (tabIndex) => {
        this.setState(prevState => ({
            isOpened: !prevState.isOpened,
            selectedTab: tabIndex,
        }));
    };

    render() {
        const { selectedTab, tabIndice, isOpened } = this.state;
        const {
            toggleViewMode, depthChartMode, showDepthChartMode, toggleOrderHistoryMode, classes, children,
            orderHistoryMode, tabs, handleTabChange, baseSymbol, quoteSymbol,
        } = this.props;

        return (
            <Fragment>
                {/* <ToggleBtn onClick={toggleViewMode}> */}
                {/* <svg viewBox="0 0 15 8.9"> */}
                {/* <g> */}
                {/* <path */}
                {/* d="M7.5 8.9L.3 1.7C-.1 1.3-.1.7.3.3s1-.4 1.4 0l5.8 5.8L13.3.3c.4-.4 1-.4 1.4 0s.4 1 0 1.4L7.5 8.9z" */}
                {/* /> */}
                {/* </g> */}
                {/* </svg> */}
                {/* </ToggleBtn> */}

                <FormHeader id="form-header">
                    <ExchangesLabel id="form-label" />

                    {/*
                    <TabsWrapper id="tabs-wrapper">
                        <Tabs
                            id="tabs"
                            value={tabIndex}
                            onChange={handleTabChange}
                            classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                        >
                            {tabs && tabs.map((tab, idx) => (
                                <Tab key={idx} label={tab}/>
                            ))}
                        </Tabs>
                    </TabsWrapper>
                    */}
                    <TabsWrapper>
                        {
                            tabs.map((tab, index) => (
                                <DropdownWrapper ref={ref => { this.wrapperRef[index] = ref; }} key={index}>
                                    <SelectedItem onClick={() => this.toggleDropdown(index)}>
                                        <span>{tabs[index][tabIndice[index]]}</span>
                                        <ArrowIcon open={isOpened} />
                                    </SelectedItem>

                                    {isOpened && (selectedTab === index) && (
                                        <Dropdown>
                                            {tab.map((item, mIndex) => (
                                                <Item
                                                    key={`${index}-${mIndex}`}
                                                    active={tabIndice[index] === mIndex}
                                                    onClick={this.handleTabChange(index, mIndex, item)}
                                                >
                                                    {item}
                                                </Item>
                                            ))}
                                        </Dropdown>
                                    )}
                                </DropdownWrapper>
                            ))
                        }
                    </TabsWrapper>
                </FormHeader>
                {children[tabIndice[1]] || <div/>}
            </Fragment>
        );
    }
}

export default compose(
    inject(
        STORE_KEYS.MARKETMAKER,
        STORE_KEYS.VIEWMODESTORE,
        STORE_KEYS.INSTRUMENTS,
        STORE_KEYS.ORDERBOOKBREAKDOWN,
        STORE_KEYS.EXCHANGESSTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.MARKETMAKER]: {
                toggleViewMode,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                depthChartMode,
                orderHistoryMode,
                showDepthChartMode,
                toggleOrderHistoryMode,
                setAdvancedAPIMode,
            },
            [STORE_KEYS.ORDERBOOKBREAKDOWN]: {
                base : baseSymbol,
                quote : quoteSymbol,
            },
        }) => {
            return ({
                toggleViewMode,
                depthChartMode,
                orderHistoryMode,
                showDepthChartMode,
                toggleOrderHistoryMode,
                setAdvancedAPIMode,
                baseSymbol,
                quoteSymbol,
            });
        }
    ),
    withStyles(styles),
)(OrderTabs);
