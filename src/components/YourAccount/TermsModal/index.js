import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components/macro';

import Modal from './Modal';

/*
    this component uses 2nd modal, overlapping 1st one
    easier to add it's own implementation to cover currently opened modal
    than to use mobx+modalPortal and provide huge changes just for that feature
    (right now this is the only place where this construction is used)
*/

const Test = () => (
    <p>test</p>
);

const Wrapper = styled.div`
    /* we have to cover sidebar, not touching it in this ticket */
    z-index: 1000000;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
`;

const TermsModal = ({ show }) => (
    ReactDOM.createPortal(
        <Wrapper>
            <Modal
                show={show}
            />
        </Wrapper>,
        document.getElementById('modal'),
    )
);

export default TermsModal;
