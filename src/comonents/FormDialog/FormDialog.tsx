"use client";

import React, {useCallback, useEffect, useRef, useState} from "react";
import styles from "./formDialog.module.scss"
import {useClickOutside} from "@/hooks/useClickOutside";
import TickerSearchList from "@/comonents/TickerSearchList/TickerSearchList";

interface FormDialogProps {
  isOpen: boolean
  tickers: Ticker[] | null
  onClose: () => void
  onSubmit: (data: {ticker: Ticker, amount: number}) => void
}

export default function FormDialog({isOpen, onClose, onSubmit, tickers}: FormDialogProps) {
  const [search, setSearch] = useState("");
  const [amount, setAmount] = useState<number|undefined>(undefined);
  const [selectTicker, setSelectTicker] = useState<Ticker | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dialogContentRef = useRef<HTMLDivElement>(null);

  const closeModal = useCallback(() => {
    setSelectTicker(null);
    setSearch("");
    setAmount(undefined);
    dialogRef.current?.close();
    onClose();
  }, [onClose])

  useClickOutside(dialogContentRef, () => isOpen && onClose());

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog) {
      if (isOpen) {
        dialog.showModal();
      } else {
        closeModal();
      }

      dialog.addEventListener("close", onClose);

      return () => dialog.removeEventListener("close", onClose)
    }
  }, [closeModal, isOpen, onClose]);

  const handelSearchInputChange = useCallback((ev: React.ChangeEvent) => {
    const target = ev.target as HTMLInputElement;

    setSearch(target.value);
  }, []);

  const handleAmountInputChange = useCallback((ev: React.ChangeEvent) => {
    const target = ev.target as HTMLInputElement;

    if (target.value === "") {
      setAmount(undefined)
    }
    else {
      setAmount(Number(target.value));
    }

  }, []);

  const handleItemClick = useCallback((ticker: Ticker) => {
    setSelectTicker(ticker);
  }, []);

  const handleSubmit = useCallback((ev: React.FormEvent) => {
    ev.preventDefault();
    if (selectTicker === null) {
      return
    }

    closeModal();

    onSubmit({
      ticker: selectTicker,
      amount: amount || 0
    })

  }, [amount, closeModal, onSubmit, selectTicker])

  return (
    <dialog ref={dialogRef} className={styles.formDialog}>
      <div ref={dialogContentRef} className={styles.formWrapper}>
        <form action="" onSubmit={handleSubmit}>
          <input type="text" placeholder={"Поиск валюты"} onChange={handelSearchInputChange} value={search}/>
          <TickerSearchList tickers={tickers} searchString={search} onItemClick={handleItemClick} />
          {
            selectTicker &&
              <>
                  <input type="number" min={0} max={10000} placeholder={"Введите количество монет"} onChange={handleAmountInputChange}/>
                  <button className={styles.submitBtn} type={"submit"}>Добавить в портфель</button>
              </>
          }
        </form>
      </div>
    </dialog>
  );
}
