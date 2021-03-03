import React, { PureComponent } from 'react';

import { formatTotalDigitString } from '@/utils';

import { Container, PriceWrapper, Icon, Arrow } from './styles';

class CustomTooltip extends PureComponent {
    getPrice = () => {
        const { tooltipModel, datasets } = this.props;

        const { datasetIndex, index } = tooltipModel;
        const data = datasets[datasetIndex][index];

        return <PriceWrapper>{formatTotalDigitString(data.x, 6)}</PriceWrapper>;
    };

    getArrow = () => {
        return (
            <Arrow xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" x="0px" y="0px">
                <path d="M97.64,44.1,64.72,11.18a8.06,8.06,0,1,0-11.4,11.39L72.78,42H8.06a8.06,8.06,0,0,0,0,16.12H72.6L53.32,77.43a8.06,8.06,0,0,0,11.4,11.39L97.64,55.9A8,8,0,0,0,100,50.2a1.27,1.27,0,0,0,0-.2,1.41,1.41,0,0,0,0-.2A8.07,8.07,0,0,0,97.64,44.1Z" />
            </Arrow>
        );
    };

    getCoinIcon = coinName => {
        return <Icon src={`img/coin/coin-${coinName.toLowerCase()}.svg`} alt={coinName} />;
    };

    render() {
        const { tooltipModel, base, quote } = this.props;

        if (!tooltipModel || !tooltipModel.meta) {
            return false;
        }

        const { datasetIndex, tooltipXPosition, meta } = tooltipModel;

        const left = meta.x + (datasetIndex ? 1 : -1);

        return (
            <Container left={left} datasetIndex={datasetIndex} tooltipXPosition={tooltipXPosition}>
                {this.getCoinIcon(datasetIndex ? quote : base)}
                {!!datasetIndex && this.getPrice()}
                {this.getArrow()}
                {!datasetIndex && this.getPrice()}
                {this.getCoinIcon(datasetIndex ? base : quote)}
            </Container>
        );
    }
}

export default CustomTooltip;
