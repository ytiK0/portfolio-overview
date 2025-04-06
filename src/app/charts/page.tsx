"use client";

import {useLocalStorage} from "@/hooks/useLocalStorage";
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import styles from "./chartPage.module.scss";
import React, {useCallback, useMemo, useState} from "react";

export default function Charts() {
  const [aggregateBy, setAggregateBy] = useState<keyof Asset>("amount");
  const [assets] = useLocalStorage("assets", []);

  const handleRadioChange = useCallback((ev: React.ChangeEvent) => {
    const target = ev.target as HTMLInputElement;

    setAggregateBy(target.value as keyof Asset);
  }, []);

  const sortedAssets = useMemo(() => assets.sort((a, b) => b[aggregateBy] - a[aggregateBy]), [aggregateBy, assets]);

  return (
    <>
      <header>
        <h1>Количественный анализ портфеля</h1>
      </header>
      <main>
        {
          sortedAssets.length === 0 ? <span>Ваш портфель пуст 😞, возвращайтесь когда добавите монеты</span>
            : <>
              <ResponsiveContainer width="100%" height={500}>
                <BarChart data={sortedAssets}>
                  <XAxis dataKey="ticker" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey={aggregateBy} fill="#0DA4DDFF" />
                </BarChart>
              </ResponsiveContainer>

              <section className={styles.selectionSection}>
                Сортировать по:
                <label className={styles.label} htmlFor="amount">
                  <input id="amount"
                         type="radio"
                         value="amount"
                         name="sortBy"
                         onChange={handleRadioChange}
                         defaultChecked/>
                  Количество монет
                </label>
                <label className={styles.label} htmlFor="totalPrice">
                  <input id="totalPrice"
                         type="radio"
                         value="totalPrice"
                         name="sortBy"
                         onChange={handleRadioChange}/>
                  Общая стоимость
                </label>
                <label className={styles.label} htmlFor="partInPortfolio">
                  <input id="partInPortfolio"
                         type="radio"
                         value="partInPortfolio"
                         name="sortBy"
                         onChange={handleRadioChange}/>
                  Процент в портфеле
                </label>
                <label className={styles.label} htmlFor="price">
                  <input id="price"
                         type="radio"
                         value="price"
                         name="sortBy"
                         onChange={handleRadioChange}/>
                  Цена за монету
                </label>
              </section>
            </>
        }
      </main>
    </>
  );
}
