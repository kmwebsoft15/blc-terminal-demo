import React, { Component, Fragment } from 'react';
import styled, { keyframes } from 'styled-components/macro';
import 'react-circular-progressbar/dist/styles.css';
import DataLoader from '../DataLoader';
import Spinner from '../Spinner';

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

    div.close {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 40px;
        left: calc(50% - 20px);
        top: calc(50% - 20px);
        border-radius: 50%;
        background: transparent;
        padding: 8px;
        z-index: 10;

        svg {
            width: 17px;
            height: 20px;
            fill: #FFF;
        }
    }
`;

class ButtonLoader extends Component {
    cancel = (e) => {
        const {
            onCancelOrder,
        } = this.props;
        // onCancelOrder();
        e.stopPropagation();
    }

    render() {
        const { isSimple } = this.props;
        return (
            <GradientButtonStyleWrapper
                isSimple={isSimple}
            >
                <DataLoader />
                {/* <div
                    className="close"
                    onClick={this.cancel}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                        <path fill="white" d="M144 479H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h96c26.5 0 48 21.5 48 48v352c0 26.5-21.5 48-48 48zm304-48V79c0-26.5-21.5-48-48-48h-96c-26.5 0-48 21.5-48 48v352c0 26.5 21.5 48 48 48h96c26.5 0 48-21.5 48-48z"></path>
                    </svg>
                </div> */}
            </GradientButtonStyleWrapper>
        );
    }
}

export default ButtonLoader;
