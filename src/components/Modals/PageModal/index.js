import React from 'react';
import ReactDOM from 'react-dom';
import privacyPolicy from './privacy-policy.md';
import termsOfUse  from './terms-of-use.md';
import Modal from './Modal';
import {
    PageModalWrapper,
} from './Components';

const pages = {};

class PageModal extends React.Component {
    state = {
        pageId: null,
        text: '',
        isLoading: true,
    };

    componentDidMount() {
        if (pages[this.props.pageId]) {
            this.setState({
                text: pages[this.props.pageId],
                isLoading: false,
                pageId: this.props.pageId,
            });
        } else {
            this.loadPage(this.props.pageId);
        }
    }

    componentDidUpdate() {
        if (pages[this.props.pageId]) {
            if (this.props.pageId !== this.state.pageId) {
                this.setState({
                    text: pages[this.props.pageId],
                    isLoading: false,
                    pageId: this.props.pageId,
                });
            }
        } else {
            this.loadPage(this.props.pageId);
        }
    }

    loadPage = (pageId) => {
        let page;
        if (pageId === 'privacy-policy') {
            page = privacyPolicy;
        } else if (pageId === 'terms-of-use') {
            page = termsOfUse;
        }
        fetch(page)
            .then(response => response.text())
            .then(text => {
                this.setState({
                    text,
                    isLoading: false,
                    pageId,
                });
                pages[pageId] = text;
            })
            .catch(e => {
                console.error(e);
                this.setState({
                    isLoading: false,
                });
            });
    }

    handleWrapperClick = e => {
        const { backdropClose, toggleModal } = this.props;
        e.preventDefault();

        if (backdropClose) {
            toggleModal();
        }
    }

    render() {
        const { inLineMode, hoverMode, isModalOpen, toggleModal } = this.props;
        const { text, isLoading } = this.state;
        const className = inLineMode
            ? (isModalOpen ? 'animate-appear' : 'animate-disappear')
            : '';

        return ReactDOM.createPortal(
            <PageModalWrapper
                hoverMode={hoverMode}
                inLineMode={inLineMode}
                className={className}
                onClick={this.handleWrapperClick}
            >
                <Modal
                    toggleModal={toggleModal}
                    text={text}
                    isLoading={isLoading}
                />
            </PageModalWrapper>,
            document.getElementById('modal'),
        );
    }
}

export default PageModal;
