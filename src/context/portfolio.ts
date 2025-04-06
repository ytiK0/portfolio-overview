import {useAssetAggregator} from "@/hooks/useAssetAggregator";
import {createContext} from "react";

type PortfolioTableContext = Omit<ReturnType<typeof useAssetAggregator>, "assets" | "aggregator">;

export const PortfolioTableContext = createContext<PortfolioTableContext>({
  removeAsset: () => {},
  pushAsset: () => {},
  updateAsset: () => {}
});