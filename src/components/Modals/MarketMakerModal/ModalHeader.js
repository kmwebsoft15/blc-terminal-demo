import React, { Component } from 'react';

import {
    HeaderWrapper,
    DropdownWrapper,
    CurrentItem,
    DropdownList,
    ListItem,
    DropIcon
} from './Components';

class ModalHeader extends Component {
    state = {
        isOpen: false,
    };

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.state.isOpen && this.wrapperRef && this.wrapperRef.contains && !this.wrapperRef.contains(event.target)) {
            this.setState({
                isOpen: false,
            });
        }
    };

    toggleDropdown = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen,
        }));
    };

    selectMenu = (menu) => {
        this.props.selectMenu(menu);
        this.toggleDropdown();
    };

    render() {
        const { isOpen } = this.state;
        const { symbol, menu, menuItems } = this.props;

        return (
            <HeaderWrapper>
                <span>{`My ${symbol}`}</span>

                <DropdownWrapper
                    ref={ref => this.wrapperRef = ref}
                    isOpen={isOpen}
                >
                    <CurrentItem
                        className={isOpen ? 'opened' : ''}
                        onClick={this.toggleDropdown}
                    >
                        <span>{menu}</span>
                        <DropIcon />
                    </CurrentItem>

                    {isOpen && (
                        <DropdownList>
                            {menuItems.map((menuItem, index) => (
                                <ListItem
                                    key={index}
                                    onClick={() => this.selectMenu(menuItem)}
                                >
                                    {menuItem}
                                </ListItem>
                            ))}
                        </DropdownList>
                    )}
                </DropdownWrapper>
            </HeaderWrapper>
        );
    }
}

export default ModalHeader;
