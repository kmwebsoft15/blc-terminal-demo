import React from 'react';
import Content from './Content';
import {
    ModalWrapper,
    ModalInnerWrapper,
    Close,
    Icon,
} from './Components';
import x from '@/components-generic/Modal/x.svg';

class Modal extends React.Component {
    handleInnerWrapperClick = e => {
        e.preventDefault();
        e.stopPropagation();
    }

    handleCloseClick = e => {
        const { toggleModal } = this.props;
        e.preventDefault();
        e.stopPropagation();
        toggleModal();
    }

    render() {
        const { noCloseBtn, text, isLoading } = this.props;
        return (
            <ModalWrapper>
                <ModalInnerWrapper
                    onClick={this.handleInnerWrapperClick}
                >
                    {!noCloseBtn && (
                        <Close
                            onClick={this.handleCloseClick}
                        >
                            <Icon src={x} />
                        </Close>
                    )}
                    <Content text={text} isLoading={isLoading} />
                </ModalInnerWrapper>
            </ModalWrapper>
        );
    }
}

export default Modal;
