import styles from "./tickerSearchList.module.scss";
import {useCallback} from "react";

interface TickerListItemProps {
  ticker: Ticker,
  onClick: (ticker: Ticker) => void
}

export default function TickerListItem({ticker, onClick}: TickerListItemProps) {
  const currencyFormatter = new Intl.NumberFormat("ru-RU", {style: "currency", currency: "USD"});
  const percentFormatter = new Intl.NumberFormat("ru-RU", {style: "decimal"})

  const {ticker: tickerName, changePercent, price} = ticker;
  const isPositive = changePercent >= 0;

  const handelItemClick = useCallback(() => {
    onClick(ticker)
  }, [onClick, ticker])

  return (
    <div className={styles.listItem} onClick={handelItemClick}>
      <span>{tickerName}</span>
      <span style={{textAlign: "center"}}>{currencyFormatter.format(price)}</span>
      <span style={{color: isPositive ? "green" : "red", textAlign: "right"}}>{isPositive ? "+":""}{percentFormatter.format(changePercent)}%</span>
    </div>
  );
}
