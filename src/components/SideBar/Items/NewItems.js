/* eslint-disable react/no-danger */
import React from 'react';
import { compose, withProps } from 'recompose';
import { inject, observer } from 'mobx-react';
import { Tooltip } from 'react-tippy';

import { STORE_KEYS } from '../../../stores';
import { viewModeKeys } from '../../../stores/ViewModeStore';
import { Link } from '../../Router';
import {
    Wrapper, Middle, Bottom, AdditionalButton
} from '../Component';
import { St, Pg } from '../icons';
import TopSection from './TopSection';

const Items = ({
    pathname, Modal, portfolioData, height, setViewMode,
}) => {
    return (
        <Wrapper className="items-wrapper" height={height}>
            <TopSection pathname={pathname} />

            <Middle>
                {/*
                <Link
                    className={`nav-bar__item${pathname === '/' ? ' active' : ''}`}
                    to="/"
                >
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="API"
                    >
                        <Pg/>
                        <p className="nav-bar__title">API</p>
                    </Tooltip>
                </Link>
                */}

                <Link
                    className={`nav-bar__item${pathname === '/ico' ? ' active' : ''}`}
                    to="/ico"
                >
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="ICO"
                    >
                        <Pg/>
                        <p className="nav-bar__title">ICO</p>
                    </Tooltip>
                </Link>

                <Link
                    className={`nav-bar__item${pathname === '/charts' ? ' active' : ''}`}
                    to="/charts"
                >
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="Charts"
                    >
                        <Pg/>
                        <p className="nav-bar__title">Charts</p>
                    </Tooltip>
                </Link>

                <Link
                    className={`nav-bar__item${pathname === '/stats' ? ' active' : ''}`}
                    to="/stats"
                >
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="Stats"
                    >
                        <Pg/>
                        <p className="nav-bar__title">Stats</p>
                    </Tooltip>
                </Link>

                <Link
                    className={`nav-bar__item${pathname === '/news' ? ' active' : ''}`}
                    to="/news"
                >
                    <Tooltip
                        arrow={true}
                        animation="shift"
                        position="right"
                        theme="bct"
                        title="News"
                    >
                        <Pg/>
                        <p className="nav-bar__title">News</p>
                    </Tooltip>
                </Link>
            </Middle>

            <Bottom>
                {/*
                <AdditionalButton
                    className="user-bar__btn"
                    data="tippy"
                    data-tippy-placement="right"
                    data-tippy-size="large"
                    title="Reload"
                    onClick={() => {
                        window.location.reload();
                    }}
                >
                    <Fr/>
                </AdditionalButton>

                <AdditionalButton
                    className="user-bar__btn"
                    data="tippy"
                    data-tippy-placement="right"
                    data-tippy-size="large"
                    title="Exchange"
                    onClick={handleExchangesOpen}
                >
                    <Ex/>
                </AdditionalButton>
                */}

                {/*
                <AdditionalButton
                    onClick={() => setViewMode(viewModeKeys.settingsModeKey)}
                    className="user-bar__btn"
                    data="tippy"
                    data-tippy-placement="right"
                    data-tippy-size="large"
                    title="Settings"
                    id="settings"
                >
                    <St/>
                </AdditionalButton>
                */}
            </Bottom>
        </Wrapper>
    );
};

const withStores = compose(
    inject(STORE_KEYS.MODALSTORE, STORE_KEYS.YOURACCOUNTSTORE, STORE_KEYS.VIEWMODESTORE),
    observer,
    withProps(
        ({
            [STORE_KEYS.MODALSTORE]: {
                Modal,
            },
            [STORE_KEYS.YOURACCOUNTSTORE]: {
                portfolioData,
            },
            [STORE_KEYS.VIEWMODESTORE]: {
                setViewMode,
            },
        }) => ({
            Modal,
            portfolioData,
            setViewMode,
        })
    )
);

export default withStores(Items);
