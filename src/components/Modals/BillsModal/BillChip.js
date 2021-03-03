import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import { getDenoSymbol } from '@/utils'

import { ChipWrapper, ChipBGImg, ChipPrice, ChipPriceUnit, ChipSymbol, convertLevel } from './ChipComponents'

const BillChip = props => {
    const { level, disabled, isDeposit, symbol, deno, onClick } = props
    const srcUrl = `./img/bills/thumb_${isDeposit ? 11 : convertLevel(level)}.png`
    let { unit, unitSymbol } = getDenoSymbol(deno)

    return (
        <ChipWrapper disabled={disabled} onClick={onClick}>
            <ChipBGImg src={srcUrl} />
            <ChipPrice>
                <ChipPriceUnit>{unit}</ChipPriceUnit>
                <ChipSymbol>
                    <p>{symbol}</p>
                    <p>{unitSymbol}</p>
                </ChipSymbol>
            </ChipPrice>
        </ChipWrapper>
    )
}

BillChip.propTypes = {
    deno: PropTypes.number.isRequired,
    disabled: PropTypes.bool,
    isDeposit: PropTypes.number,
    level: PropTypes.number.isRequired,
    symbol: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
}
BillChip.defaultProp = {
    disabled: true,
    isDeposit: false,
}

export default BillChip
