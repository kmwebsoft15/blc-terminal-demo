import React from 'react';
import styled from 'styled-components/macro';

export const Wrapper = styled.div`
    position: relative;
    max-width: 100%;
    height: 50px;
    flex: 1;
    display: flex;
    align-items: center;
    background: ${props => props.theme.palette.clrBackground};
    // border: 1px solid ${props => props.theme.palette.clrBorder};
    // border-radius: ${props => props.theme.palette.borderRadius};
`;

export const LabelWrapper = styled.div`
    position: absolute;
    margin: -16px 0 0 6px;
    padding: 2px;
    display: none;
    align-items: center;
    background-color: ${props => props.theme.palette.clrback};
`;

export const Label = styled.p`
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    line-height: 0.8;
    color: ${props => props.theme.palette.depositLabel};
`;

export const InputFieldWrapper = styled.div.attrs({ className: 'exch-deposit-input' })`
    max-width: 100%;
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    overflow: visible;
`;

export const Input = styled.input`
    width: ${props => props.addonWidth ? `calc(100% - ${props.addonWidth}px)` : '100%'};
    padding: 0 10px;
    background: transparent;
    border: 0;
    font-size: 18px;
    color: ${props => props.theme.palette.contrastText};

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: ${props => props.theme.palette.depositText};
    }
`;

export const InputMulti = styled.textarea`
    width: ${props => props.addonWidth ? `calc(100% - ${props.addonWidth}px)` : '100%'};
    padding: 0 10px;
    background: transparent;
    border: 0;
    font-size: 18px;
    color: ${props => props.theme.palette.contrastText};
    resize: none;

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: ${props => props.theme.palette.depositText};
    }
`;

const valueThumbWidth = 70;
const valueThumbHeight = 16;
const thumbRadius = 12;
const MULTIPLIER = 10000;

export const SliderWrapper = styled.div.attrs({ className: 'slider-input' })`
    position: absolute;
    left: 2px;
    right: ${props => (props.addonWidth || 136) + 2}px;
    bottom: -15px;
    height: ${thumbRadius}px;
    padding: 15px 0;
    display: flex;
    align-items: center;
    justify-content: stretch;
    overflow: hidden;

    input[type=range] {
        -webkit-appearance: none;
        width: 100%;
        height: ${thumbRadius}px;
        background: transparent;
        padding: 0;
        margin: 0;
        cursor: pointer;
        z-index: 5;

        &, &:focus, &:active {
            outline: none;
        }

        // At zero value, make thumb same color as emptry track
        &.zero {
            &::-webkit-slider-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
            }

            &::-moz-range-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
            }

            &::-ms-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
            }
        }

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: ${thumbRadius}px;
            height: ${thumbRadius}px;
            background: ${props => (props.colors && props.colors.ctrlSliderThumbBg) || props.theme.palette.ctrlSliderThumbBg};
            border: 1px solid ${props => (props.colors && props.colors.ctrlSliderThumbBorder) || props.theme.palette.ctrlSliderThumbBorder};
            border-radius: 50%;
            cursor: pointer;
        }

        &::-webkit-slider-runnable-track {
            -webkit-appearance: none;
            width: 100%;
            height: ${thumbRadius}px;
            cursor: pointer;
            background: transparent;
        }

        &::-moz-range-thumb {
            width: ${thumbRadius}px;
            height: ${thumbRadius}px;
            background: ${props => (props.colors && props.colors.ctrlSliderThumbBg) || props.theme.palette.ctrlSliderThumbBg};
            border: 1px solid ${props => (props.colors && props.colors.ctrlSliderThumbBorder) || props.theme.palette.ctrlSliderThumbBorder};
            border-radius: 50%;
        }

        &::-moz-range-track {
            width: 100%;
            height: ${thumbRadius}px;
            background: transparent;
            cursor: pointer;
        }

        &::-moz-range-progress {
            background-color: transparent;
        }

        &::-ms-thumb {
            width: ${thumbRadius}px;
            height: ${thumbRadius}px;
            background: ${props => (props.colors && props.colors.ctrlSliderThumbBg) || props.theme.palette.ctrlSliderThumbBg};
            border: 1px solid ${props => (props.colors && props.colors.ctrlSliderThumbBorder) || props.theme.palette.ctrlSliderThumbBorder};
            border-radius: 50%;
            cursor: pointer;
        }

        &::-ms-track {
            width: 100%;
            height: ${thumbRadius}px;
            background: transparent;
            border-color: transparent;
            color: transparent;
            cursor: pointer;
        }

        &::-ms-fill-lower {
            background: transparent;
        }

        &::-ms-fill-upper {
            background: transparent;
        }

        &.tooltip {
            &::-webkit-slider-thumb {
                width: ${valueThumbWidth}px !important;
                height: ${valueThumbHeight}px !important;
                background: transparent !important;
                border: none !important;
                border-radius: 0 !important;
            }

            &::-moz-range-thumb {
                width: ${valueThumbWidth}px !important;
                height: ${valueThumbHeight}px !important;
                background: transparent !important;
                border: none !important;
                border-radius: 0 !important;
            }

            &::-ms-thumb {
                width: ${valueThumbWidth}px !important;
                height: ${valueThumbHeight}px !important;
                background: transparent !important;
                border: none !important;
                border-radius: 0 !important;
            }
        }
    }

    &:hover {
        input[type=range] {
            &::-webkit-slider-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderThumbHoverBg) || props.theme.palette.ctrlSliderThumbHoverBg};
                border-color: ${props => (props.colors && props.colors.ctrlSliderThumbHoverBorder) || props.theme.palette.ctrlSliderThumbHoverBorder};
            }

            &::-moz-range-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderThumbHoverBg) || props.theme.palette.ctrlSliderThumbHoverBg};
                border-color: ${props => (props.colors && props.colors.ctrlSliderThumbHoverBorder) || props.theme.palette.ctrlSliderThumbHoverBorder};
            }

            &::-ms-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderThumbHoverBg) || props.theme.palette.ctrlSliderThumbHoverBg};
                border-color: ${props => (props.colors && props.colors.ctrlSliderThumbHoverBorder) || props.theme.palette.ctrlSliderThumbHoverBorder};
            }

            &.tooltip {
                &::-webkit-slider-thumb {
                    background: transparent;
                    border-color: transparent;
                }

                &::-moz-range-thumb {
                    background: transparent;
                    border-color: transparent;
                }

                &::-ms-thumb {
                    background: transparent;
                    border-color: transparent;
                }
            }
        }
    }

    &:active {
        input[type=range] {
            &::-webkit-slider-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderThumbActiveBg) || props.theme.palette.ctrlSliderThumbActiveBg};
                border-color: ${props => (props.colors && props.colors.ctrlSliderThumbActiveBorder) || props.theme.palette.ctrlSliderThumbActiveBorder};
            }

            &::-moz-range-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderThumbActiveBg) || props.theme.palette.ctrlSliderThumbActiveBg};
                border-color: ${props => (props.colors && props.colors.ctrlSliderThumbActiveBorder) || props.theme.palette.ctrlSliderThumbActiveBorder};
            }

            &::-ms-thumb {
                background: ${props => (props.colors && props.colors.ctrlSliderThumbActiveBg) || props.theme.palette.ctrlSliderThumbActiveBg};
                border-color: ${props => (props.colors && props.colors.ctrlSliderThumbActiveBorder) || props.theme.palette.ctrlSliderThumbActiveBorder};
            }

            &.tooltip {
                &::-webkit-slider-thumb {
                    background: transparent;
                    border-color: transparent;
                }

                &::-moz-range-thumb {
                    background: transparent;
                    border-color: transparent;
                }

                &::-ms-thumb {
                    background: transparent;
                    border-color: transparent;
                }
            }
        }
    }
`;

export const SliderTrackWrapper = styled.div.attrs({ className: 'slider-input__track-wrapper' })`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
`;

export const SliderTrack = styled.div.attrs({ className: 'slider-input__slider-track' })`
    position: absolute;
    top: calc(50% - 1px);
    left: 0;
    right: 0;
    z-index: 1;
    width: 100%;
    height: 2px;
    margin: 0;
    padding: 0;
    background: ${props => (props.colors && props.colors.ctrlSliderTrackBg) || props.theme.palette.ctrlSliderTrackBg};
    border: none;
`;

export const SliderTrackProgress = styled.div.attrs({ className: 'slider-input__slider-track-progress' })`
    position: absolute;
    top: calc(50% - 1px);
    left: 0;
    z-index: 2;
    width: ${props => Number.parseFloat(props.progress) <= 100 ? props.progress : 100}%;
    height: 2px;
    margin: 0;
    padding: 0;
    background: ${props => (props.colors && props.colors.ctrlSliderTrackProgressBg) || props.theme.palette.ctrlSliderTrackProgressBg};
    border: none;
`;

export const SliderTrackCurrentValue = styled.div`
    position: absolute;
    top: ${valueThumbHeight / 2 - 1}px;
    left: ${props => Number.parseFloat(props.progress) <= 100 ? `calc(${props.progress}% - ${70 * props.progress / 100}px)` : 'calc(100% - 70px)'};
    bottom: 0;
    z-index: 6;
    width: ${valueThumbWidth}px;
    height: ${valueThumbHeight}px;
    margin: 0;
    padding: 0;
    background: ${props => props.theme.palette.ctrlSliderTrackCurrentBg};
    border: 1px solid ${props => props.theme.palette.ctrlSliderTrackProgressBg};
    border-radius: 3px;
    font-size: 11px;
    line-height: 14px;
    color: ${props => props.theme.palette.ctrlSliderTrackProgressBg};
    text-align: center;

    &:before,
    &:after {
        content: '';
        position: absolute;
        bottom: 3px;
        width: 0;
        border-style: solid;
        border-width: 4px;
        border-color: transparent ${props => props.theme.palette.ctrlSliderTrackProgressBg} transparent transparent;
    }

    &:before {
        left: -9px;
        display: ${props => Number.parseFloat(props.progress) > 0 ? 'block' : 'none'};
        border-color: transparent ${props => props.theme.palette.ctrlSliderTrackProgressBg} transparent transparent;
    }

    &:after {
        right: -9px;
        display: ${props => Number.parseFloat(props.progress) < 100 ? 'block' : 'none'};
        border-color: transparent transparent transparent ${props => props.theme.palette.ctrlSliderTrackProgressBg};
    }

    input {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 7;
        background: ${props => props.theme.palette.ctrlSliderTrackCurrentBg};
        border: 1px solid ${props => props.theme.palette.ctrlSliderTrackProgressBg};
        border-radius: 3px;
        font-size: 11px;
        line-height: 14px;
        color: ${props => props.theme.palette.ctrlSliderTrackProgressBg};
        text-align: center;
        outline: none;
    }
`;

export const Delimeter = styled.div.attrs({ className: 'slider-input__slider-delimeter' })`
    position: absolute;
    top: calc(50% - 4px);
    left: calc(${props => props.position}% - 4px);
    z-index: 3;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => (props.colors && props.colors.ctrlSliderDelimiterBg) || props.theme.palette.ctrlSliderDelimiterBg};
    border: 1px solid ${props => (props.colors && props.colors.ctrlSliderDelimiterBorder) || props.theme.palette.ctrlSliderDelimiterBorder};

    &.active {
        background: ${props => (props.colors && props.colors.ctrlSliderDelimiterActiveBg) || props.theme.palette.ctrlSliderDelimiterActiveBg};
        border: 2px solid ${props => (props.colors && props.colors.ctrlSliderDelimiterActiveBorder) || props.theme.palette.ctrlSliderDelimiterActiveBorder};
    }
`;
