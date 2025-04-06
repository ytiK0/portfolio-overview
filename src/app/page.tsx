"use client";

import styles from "./page.module.scss";
import PortfolioTable from "@/comonents/PortolioTable/PortfolioTable";
import {useCallback, useEffect, useMemo, useState} from "react";
import FormDialog from "@/comonents/FormDialog/FormDialog";
import {useFetch} from "@/hooks/useFetch";
import {useAssetAggregator} from "@/hooks/useAssetAggregator";
import {PortfolioTableContext} from "@/context/portfolio";
import Link from "next/link";
const WS_UPDATE_DELAY_IN_SECONDS = 3;

export default function Home() {
  const usdFormatter = new Intl.NumberFormat("ru-RU", {style: "currency", currency: "USD"});
  const numberFormatter = new Intl.NumberFormat("ru-RU")
  const [isFormOpen, setIsFormOpen] = useState(false);

  const {assets, aggregator, pushAsset, updateAsset, removeAsset} = useAssetAggregator();
  const contextValue = useMemo(() => ({pushAsset, updateAsset, removeAsset}), [assets]);

  const [isTickersLoading, tickers, error] = useFetch<BinanceResponse[], Ticker[]>("https://api.binance.com/api/v3/ticker/24hr", processRequest);

  function processRequest (rawTickers: BinanceResponse[]) {
    return rawTickers
        .filter(({symbol, lowPrice}) => symbol.endsWith("USDT") && symbol.length >= 7 && symbol.length <= 9 && Number(lowPrice) > 0)
        .slice(0, 75)
        .map<Ticker>(({symbol, lowPrice, priceChangePercent}) => ({
          ticker: symbol.replace("USDT", ""),
          price: Number(lowPrice),
          changePercent: Number(priceChangePercent)
        }));
  }

  useEffect(() => {
    const symbols = assets.map(({ticker}) => ticker.toLowerCase() + "usdt@ticker").join("/");

    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${symbols}`);

    let lastEvent: {data: {P: string, l: string}, stream: string} | null = null;
    let timeout: NodeJS.Timeout | null = null;

    ws.onmessage = ({ data }) => {
      lastEvent = JSON.parse(data) as {data: {P: string, l: string}, stream: string}

      if (timeout !== null) {
        return;
      }

      timeout = setTimeout(() => {
        if (lastEvent === null) {
          return;
        }
        const { data, stream } = lastEvent;
        const ticker = stream.replace("usdt@ticker", "");

        updateAsset(ticker, {price: parseFloat(data.P), change: parseFloat(data.l)});

        clearTimeout(timeout!);
      }, WS_UPDATE_DELAY_IN_SECONDS * 1000);
    }

    return () => {
      if (ws.readyState === 1) {
        ws.close()
      } else {
        ws.onopen = () => ws.close();
      }
      if (timeout) {
        clearTimeout(timeout);
      }
    }
  }, [assets, updateAsset]);

  const closeModal = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const handleFormOpen = useCallback(() => {
    setIsFormOpen(true);
  }, []);

  const handleModalFormSubmit = useCallback((data: AssetProto) => {
    pushAsset(data);
  }, [pushAsset]);

  return (
    <>
      <header className={styles.header}>
        <h1>Ваш портфель</h1>
        <button className={styles.addNewButton} onClick={handleFormOpen} disabled={isTickersLoading || error}>Добавить актив</button>

      </header>
      <main className={styles.main}>
        {
          error ?
            <span style={{color: "red"}}>К сожалению мы не смогли загрузить активные валюты, пожалуйста попробуйте позже</span>
            : isTickersLoading ? <span className={"loader"}></span>
              : <>
                <section className={styles.overviewSection}>
                  <div>Общая стоимость портфеля: {usdFormatter.format(aggregator.getTotalPrice())}</div>
                  <div>Общее количество монет: {numberFormatter.format(aggregator.getTotalAmount())}</div>
                </section>
                <section>
                  <PortfolioTableContext.Provider value={contextValue}>
                    <PortfolioTable/>
                  </PortfolioTableContext.Provider>
                  <FormDialog tickers={tickers}
                              isOpen={isFormOpen}
                              onClose={closeModal}
                              onSubmit={handleModalFormSubmit}
                  />
                </section>
                <footer className={styles.footer}>
                  <Link href={"/charts"}>Проанализировать портфель</Link>
                </footer>
              </>


        }
      </main>
    </>
  );
}
