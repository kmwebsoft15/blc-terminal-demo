import React from 'react';
import styled from 'styled-components/macro';
import { darkTheme } from '../../../theme/core';

const { palette } = darkTheme;

export const Wrapper = styled.div.attrs({ className: 'congrats-wrapper' })`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: none;
  padding: 0;
  margin-bottom: 20px;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1110;
`;

export const CongratsIcon = styled.img.attrs({ className: 'congrats-icon' })`
  width: 100px;
  height: 100px;
  margin-bottom: 20px;
`;

export const CongratsText = styled.div.attrs({ className: 'congrats-text' })`
  font-family: 'open_sans', sans-serif;
  font-size: 40px;
  color: #fff;
`;

export const CongratsClose = styled.img.attrs({ className: 'contrats-close' })`
  position: absolute;
  width: 30px;
  height: 30px;
  top: 30px;
  right: 30px;

  &:active {
    opacity: .7;
  }
`;