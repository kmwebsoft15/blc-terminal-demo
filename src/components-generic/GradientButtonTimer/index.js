import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { keyframes } from 'styled-components/macro';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { withSafeInterval } from '@hocs/safe-timers';
import 'react-circular-progressbar/dist/styles.css';

const GradientButtonStyleWrapper = styled.button.attrs({ className: 'gradient-button' })`
    position: ${props => props.isSimple ? 'absolute' : 'relative'};
    top: ${props => props.isSimple ? '0px' : ''};
    left: ${props => props.isSimple ? '0px' : ''};
    display: flex;
    overflow: hidden;
    padding: 0;
    width: ${props => props.width ? (props.width + 'px') : '100%'};
    height: ${props => props.height ? (props.height + 'px') : '100%'};
    border: none;
    border-radius: 3px;
    // background: ${props => props.disable ? 'transparent' : props.theme.palette.clrBlue};
    background: transparent;
    outline: none !important;
    cursor: pointer;

    svg.CircularProgressbar  {
        height: 90%;
    }

    svg.CircularProgressbar text {
        display: ${props => props.isArbitrageMode ? 'none' : ''};
    }

    &:hover {
        svg.CircularProgressbar text {
            display: none;
        }
        div.close {
            display: flex;
        }
        .left-arrow, .right-arrow {
            display: block;
        }
    }

    div.cancel {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 26px;
        height: 26px;
        left: calc(50% - 13px);
        top: calc(50% - 13px);
        border-radius: 50%;
        background: transparent;
        padding: 5px;

        svg {
            width: 17px;
            height: 20px;
            fill: #FFF;
        }
    }

    .top-left {
        position: absolute;
        top: 0;
        left: 0;
        width: 20px;
        height: 20px;
        background: transparent;
        border: none;

    }

    .top-right {
        position: absolute;
        top: 0;
        right: 0;
        width: 20px;
        height: 20px;
        background: transparent;
        border: none;
    }
`;

class GradientButtonTimer extends Component {
    static propTypes = {
        maxTimer: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }

    static defaultProps = {
        maxTimer: 4,
    }

    state = {
        countdown: 0,
        maxTimer: Number(this.props.maxTimer),
        isFastHovered: false,
        isSlowHovered: false,
        isPaused: false,
    };

    clearTimerInterval = null;

    componentDidMount() {
        this.clearTimerInterval = this.props.setSafeInterval(this.countTimer, 1000);
        this.props.setUserDropDownOpen(false);
    }

    componentWillUnmount() {
        if (this.clearTimerInterval) {
            this.clearTimerInterval();
        }
        // const {
        //     onCancelOrder,
        // } = this.props;
        // onCancelOrder();
    }

    countTimer = () => {
        const { countdown, maxTimer, isPaused } = this.state;
        if (!isPaused) {
            if (countdown + 1 > maxTimer) {
                this.submitOrder();
            } else {
                this.setState({ countdown: countdown + 1 }, () => {
                    this.props.setDownTimerCount(this.state.countdown);
                });
            }
        }
    }

    submitOrder = () => {
        this.setState({ countdown: 0 });

        if (!this.props.disabled) {
            this.props.onSubmitOrder();
            if (this.clearTimerInterval) {
                this.clearTimerInterval();
            }
        }
    }

    cancel = (e) => {
        this.setState(prevState => ({
            isPaused: !prevState.isPaused,
        }));
        e.stopPropagation();
    }

    fastForward = (e) => {
        e.stopPropagation();
        const { maxTimer } = this.state;
        this.setState({ countdown: Math.floor(maxTimer / 6 * 5) }, () => {
            this.props.setDownTimerCount(this.state.countdown);
        });
    }

    slowForward = (e) => {
        e.stopPropagation();
        const { maxTimer } = this.state;
        this.setState({
            countdown: Math.floor(maxTimer / 10),
            maxTimer: 180,
        }, () => {
            this.props.setDownTimerCount(this.state.countdown);
            this.props.setMaxDownTimerCount(this.state.maxTimer);
        });
    }

    setForwardTrack = (mode) => () => {
        this.setState({ isFastHovered: mode });
    }

    setSlowTrack = (mode) => () => {
        this.setState({ isSlowHovered: mode });
    }

    render() {
        const {
            isArbitrageMode,
            disabled,
            isSimple,
        } = this.props;
        const {
            countdown,
            maxTimer,
            isFastHovered,
            isSlowHovered,
        } = this.state;
        const slowTrackValue = Math.floor(maxTimer / 10);
        const fastTrackValue = Math.floor(maxTimer / 6 * 5);
        const countValue = isFastHovered ? fastTrackValue : isSlowHovered ? slowTrackValue : countdown;
        return (
            <GradientButtonStyleWrapper
                disable={disabled}
                isArbitrageMode={isArbitrageMode}
                isSimple={isSimple}
            >
                <CircularProgressbar
                    strokeWidth={5}
                    value={countValue}
                    maxValue={maxTimer}
                    text={`${maxTimer - countdown}s`}
                    background={true}
                    styles={buildStyles({
                        textSize: '34px',
                        textColor: '#fff',
                        pathColor: `rgba(255, 255, 255, ${isFastHovered || isSlowHovered ? '.8' : '1'})`,
                        trailColor: 'rgba(255, 255, 255, .15)',
                        backgroundColor: '#080924',
                    })}
                />
                <div
                    className="cancel"
                    onClick={this.cancel}
                >
                    {this.state.isPaused ?
                        (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="white" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"></path></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="white" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path>
                            </svg>
                        )
                    }
                </div>
                <div className="top-left" onClick={this.fastForward} onMouseEnter={this.setForwardTrack(true)} onMouseLeave={this.setForwardTrack(false)} />
                <div className="top-right" onClick={this.slowForward} onMouseEnter={this.setSlowTrack(true)} onMouseLeave={this.setSlowTrack(false)} />
            </GradientButtonStyleWrapper>
        );
    }
}

export default withSafeInterval(GradientButtonTimer);
