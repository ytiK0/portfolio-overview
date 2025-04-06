import {useCallback, useRef} from "react";
import {AssetAggregator} from "@/utils/AssetAggregator";
import {useLocalStorage} from "@/hooks/useLocalStorage";

export function useAssetAggregator() {
  const [assets, setAssets] = useLocalStorage<Asset[]>("assets", []);
  const assetAggregatorRef = useRef(new AssetAggregator(assets));

  const pushAsset = useCallback((proto: AssetProto) => {
    const assetAggregator = assetAggregatorRef.current;
    assetAggregator.push(proto);
    setAssets(assetAggregator.getAssetsList());
  }, [setAssets]);

  const updateAsset = useCallback((ticker: string, updData: Pick<Asset, "price" | "change">) => {
    const assetAggregator = assetAggregatorRef.current;
    assetAggregator.updateAsset(ticker, updData);
    setAssets(assetAggregator.getAssetsList())
  }, [setAssets]);

  const removeAsset = useCallback((ticker: string) => {
    const assetAggregator = assetAggregatorRef.current;
    assetAggregator.removeAsset(ticker);
    setAssets(assetAggregator.getAssetsList());
  }, [setAssets]);

  return {
    aggregator: assetAggregatorRef.current,
    assets,
    pushAsset,
    updateAsset,
    removeAsset
  }
}