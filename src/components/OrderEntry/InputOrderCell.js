import React from 'react';
import Input from '@material-ui/core/Input';
import styled, { css } from 'styled-components/macro';
import { withStyles } from '@material-ui/styles';
import { formatTotalDigitString } from '../../utils';

const OrderStyles = css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 60%;
    height: 32px;
    background: ${props => props.theme.palette.orderFormInputBg} !important;
    border: 2px solid ${props => props.theme.palette.orderFormInputBorder} !important;
    border-radius: 0;
    // ${props => props.readOnly ? 'color: ' + props.theme.palette.orderFormInputDisabledText + ' !important; input {color: ' + props.theme.palette.orderFormInputDisabledText + ' !important;}' : ''}
    font-size: 16px;
    font-weight: 600;

    [data-section] {
        /* overall input and coin section */
        @media (max-height: 1300px){
            padding: 0px;
        }
    }

    [data-amt] {
        /* input wrapper */
        color : ${props => props.theme.palette.orderFormInputText};
    }

    [data-inputsection] {
        /* input */
        overflow: auto;
        
        input {
            padding: 4px 4px 4px 6px;
            height: 20px;
            line-height: 20px;
            
            @media only screen and (max-width: 1300px) {
                padding: 0.2rem 0.2rem 0.2rem 5px;
            }
        }
    }

    [data-coin] {
        /* coin */
        color: ${props => props.theme.palette.orderFormInputText};
        line-height: 20px;
        height: 100%;
        text-align: right;
        padding: 4px 6px 4px 4px;
        max-width: 60px;
    }
`;

const styles = {
    input: {
        textAlign: 'left',
        paddingLeft: '10px',
    },
};

class InputOrderCell extends React.Component {
    state = {
        isFocused: false,
    };

    handleInputFocus = () => {
        this.setState({
            isFocused: true,
        });
    };

    handleInputBlur = () => {
        this.setState({
            isFocused: false,
        });
    };

    render() {
        const {
            className, classes, amount, coin, onChange, readOnly,
        } = this.props;
        const { isFocused } = this.state;

        return (
            <div className={className}>
                <Input
                    data-section
                    data-inputsection
                    classes={{ input: classes.input }}
                    data-testid="buysellorderinput"
                    placeholder="0"
                    disableUnderline
                    data-amt
                    value={(isFocused && !readOnly) ? amount : formatTotalDigitString(amount, 5)}
                    onChange={!readOnly ? onChange : () => {}}
                    onFocus={this.handleInputFocus}
                    onBlur={this.handleInputBlur}
                    readOnly={readOnly}
                />
                <div data-section data-coin>{coin}</div>
            </div>
        );
    }
}

const StyledInputOrderCell = styled(InputOrderCell)`${OrderStyles}`;

export default withStyles(styles)(StyledInputOrderCell);
