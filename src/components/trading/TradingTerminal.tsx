import React from 'react';
import { AssetTickerHeader } from './AssetTickerHeader';
import { TradingViewChart } from './TradingViewChart';
import { OrderBook } from './OrderBook';
import { TradePanel } from './TradePanel';
import { PositionsPanel } from './PositionsPanel';

export const TradingTerminal: React.FC = () => {
  return (
    <div className="flex flex-col gap-3 min-h-[calc(100vh-140px)]">
      {/* Asset Ticker & Quick Selector */}
      <AssetTickerHeader />

      {/* Main Terminal Viewport Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3 flex-1">
        {/* Left Column: Interactive Candlestick Chart (7 cols on XL) */}
        <div className="xl:col-span-7 flex flex-col gap-3">
          <div className="h-[460px] xl:h-[500px]">
            <TradingViewChart />
          </div>
          {/* Open Positions & Trade History bottom panel */}
          <div className="min-h-[220px]">
            <PositionsPanel />
          </div>
        </div>

        {/* Right Column: Order Book (2.5 cols) + Trade Execution Panel (2.5 cols) */}
        <div className="xl:col-span-5 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
          <div className="xl:col-span-2 min-h-[460px]">
            <OrderBook />
          </div>
          <div className="xl:col-span-3 min-h-[460px]">
            <TradePanel />
          </div>
        </div>
      </div>
    </div>
  );
};
