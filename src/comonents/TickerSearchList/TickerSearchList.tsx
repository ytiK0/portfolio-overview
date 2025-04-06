"use client";

import {memo, useMemo} from "react";
import styles from "./tickerSearchList.module.scss"
import TickerListItem from "@/comonents/TickerSearchList/TickerListItem";

interface SearchListProps {
  tickers: Ticker[] | null,
  searchString: string,
  onItemClick: (ticker: Ticker) => void
}

const TickerSearchList = memo(({searchString, tickers, onItemClick}: SearchListProps) => {
  const searchResult = useMemo(
    () => tickers ? tickers.filter(({ticker}) => ticker.includes(searchString.toUpperCase())) : [],
    [tickers, searchString]);

  return (
    <div className={styles.listWrapper}>
      {
        searchResult.map((ticker) => <TickerListItem key={ticker.ticker} ticker={ticker} onClick={onItemClick} />)
      }
    </div>
  );
});

TickerSearchList.displayName = "TickerSearchList";

export default TickerSearchList
