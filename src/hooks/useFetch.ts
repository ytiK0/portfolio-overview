import {useEffect, useState} from "react";


export function useFetch<ResType, OutType=ResType>(url: string, dataHandler: (fetchedData: ResType) => OutType) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<OutType | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    async function loadData() {
      try {
        const response = await fetch(url, {signal});

        if (!response.ok) {
          setError(true);
          return
        }

        const data = await response.json() as ResType;

        setData(dataHandler(data));
      }
      catch (err) {
        if ((err as {name: string}).name !== "AbortError") {
          setError(true);
        }
      }
      finally {
        setIsLoading(false);
      }
    }

    loadData()

    return () => abortController.abort()
  }, [url]);

  return [isLoading, data, error] as const;
}