export const MODE_KEYS = {
  depthChartKey: 'depth-chart',
  activeModeKey: 'active',
  filledModeKey: 'filled',
  myTradesModeKey: 'trades',
  reportsModeKey: 'reports',
  accountsModeKey: 'accounts',
  coldStorageModeKey: 'coldStorage',
  // tradingViewModeKey: 'tradingView',
  // arbitrageModeKey: 'arbitrage',
};

export const MODE_LABELS = {
  [MODE_KEYS.activeModeKey]: 'Active',
  [MODE_KEYS.filledModeKey]: 'Filled and Cancelled',
  [MODE_KEYS.myTradesModeKey]: 'My Trades',
  [MODE_KEYS.depthChartKey]: 'Depth Chart',
  [MODE_KEYS.reportsModeKey]: 'Reports',
  [MODE_KEYS.accountsModeKey]: 'Accounts',
  [MODE_KEYS.coldStorageModeKey]: 'ColdStroage',
  [MODE_KEYS.tradingViewModeKey]: 'TradingView',
  [MODE_KEYS.arbitrageModeKey]: 'Arbitrage',
}

export const EXTRA_DROPMENU_LABELS = {
  [MODE_KEYS.activeModeKey]: [],
  [MODE_KEYS.filledModeKey]: ['Status'],
  [MODE_KEYS.myTradesModeKey]: ['Trade', 'Source'],
}