import React, { Component } from 'react';

import { convertToFloat, unifyDigitString } from '../../../utils';
import {
    SliderWrapper,
    SliderTrackWrapper,
    SliderTrack,
    SliderTrackProgress,
    SliderTrackCurrentValue,
    Delimeter
} from './ChildComponents';

class SliderInput extends Component {
    state = {
        value: this.props.value,
        isShowingInput: false,
    };

    onInputChange = e => {
        this.setState({ value: this.prepareValue(e.target.value) });
    };

    onInputBlur = e => {
        this.onChange(e);
        this.setState(prevState => ({
            isShowingInput: !prevState.isShowingInput,
        }));
    };

    onChange = e => {
        if (this.props.onChange) {
            this.props.onChange(e.target.value);
        }
    };

    handleInputValueToggle = () => {
        if (!this.state.isShowingInput) {
            this.setState(prevState => ({
                value: this.props.value,
                isShowingInput: true,
            }));
        }
    };

    prepareMax = () => {
        const { max } = this.props;
        return convertToFloat(max) || 0;
    };

    prepareValue = (value) => {
        const max = this.prepareMax();
        value = convertToFloat(value) || 0;
        if (value > max) {
            return max;
        }
        return value;
    };

    render() {
        const {
            colors,
            addonWidth,
        } = this.props;
        const {
            isShowingInput,
        } = this.state;

        const max = this.prepareMax();
        const value = this.prepareValue(this.props.value);

        const progress = value > 0 ? (value / max * 100) : 0;
        const delimeters = [
            0, 50, 100
        ];

        return (
            <SliderWrapper
                className="range-slider"
                colors={colors}
                addonWidth={addonWidth}
            >
                <input
                    type="range"
                    className="slider-control tooltip"
                    min="0"
                    max={max}
                    step={max / 100}
                    value={value}
                    onChange={isShowingInput ? null : this.onChange}
                />

                <SliderTrackWrapper colors={colors}>
                    <SliderTrack colors={colors}/>

                    <SliderTrackCurrentValue
                        progress={progress}
                        onClick={this.handleInputValueToggle}
                    >
                        {isShowingInput ? (
                            <input
                                value={this.state.value}
                                ref={input => input && input.focus() && input.select()}
                                onChange={this.onInputChange}
                                onBlur={this.onInputBlur}
                            />
                        ) : unifyDigitString(value)}
                    </SliderTrackCurrentValue>

                    <SliderTrackProgress progress={progress} colors={colors}/>
                    {delimeters.map((val, key) => (
                        <Delimeter
                            position={val}
                            key={key}
                            className={progress > val ? 'active' : ''}
                            colors={colors}
                        />
                    ))}
                </SliderTrackWrapper>
            </SliderWrapper>
        );
    }
}

export default SliderInput;
