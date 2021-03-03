import React, { Fragment } from 'react';
import styled from 'styled-components/macro';
import { AutoSizer } from 'react-virtualized';
import { inject, observer } from 'mobx-react';
import { compose, withProps } from 'recompose';

import { STORE_KEYS } from '../stores';
import RightLowerSectionGrid from './RightLowerSectionGrid';
import ColdStorage from 'components/ColdStorage';
import ArbitrageDetail from 'components/ArbitrageDetail';

const StyledRightTopSectionGrid = styled.div`
    position: relative;
    margin-left: 12px;
    ${props => (props.isMobilePortrait || props.isSmallWidth) ? 'display: none;' : 'flex: 1;'}
`;

class RightTopSectionGrid extends React.Component {
    componentDidMount() {

    }

    render() {
        const {
            isMobilePortrait,
            isSmallWidth,
        } = this.props;

        return (
            <StyledRightTopSectionGrid
                isMobilePortrait={isMobilePortrait}
                isSmallWidth={isSmallWidth}
                id="right-top"
            >
                <AutoSizer>
                    {({ width, height }) => {
                        const margin = 12;
                        const lowerSectionHeight = 275;
                        return (
                            <Fragment>
                                <ArbitrageDetail
                                    width={width}
                                    height={height - lowerSectionHeight}
                                />

                                <RightLowerSectionGrid
                                    width={width}
                                    height={lowerSectionHeight - margin}
                                    hasMargin={1}
                                />
                            </Fragment>
                        );
                    }}
                </AutoSizer>
            </StyledRightTopSectionGrid>
        );
    }
}

const withStore = compose(
    inject(
        STORE_KEYS.VIEWMODESTORE,
    ),
    observer,
    withProps(
        ({
            [STORE_KEYS.VIEWMODESTORE]: {
                isArbDetailMode,
            },
        }) => ({
            isArbDetailMode,
        })
    )
);

export default withStore(RightTopSectionGrid);