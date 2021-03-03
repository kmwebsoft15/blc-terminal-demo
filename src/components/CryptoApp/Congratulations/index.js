import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import CheckIcon from './blue_check.svg';
import CloseIcon from './cancel.svg';

import {
    Wrapper,
    CongratsClose,
    CongratsIcon,
    CongratsText
} from './Components';

const Congratulations = ({
    onClose,
    message,
}) => (
    <Wrapper>
        <CongratsClose src={CloseIcon} onClick={onClose} />
        <CongratsIcon src={message === 'Congratulations' ? CheckIcon : CloseIcon} />
        <CongratsText>{message}</CongratsText>
    </Wrapper>
);

Congratulations.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default observer(Congratulations);