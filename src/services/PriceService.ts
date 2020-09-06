import axios, { AxiosInstance } from "axios";
import { setupCache } from "axios-cache-adapter";

import OptionsService from "./OptionsService";
import { Options } from "../types";
import Parser from "../utils/parser";
import BigNumber from "bignumber.js";

class PriceService {
  public static instance: PriceService;

  public client: AxiosInstance;
  public options: Options;
  public host = "https://api.coingecko.com/api/v3/";

  private constructor() {
    this.options = OptionsService.getOptions();

    const cache = setupCache({
      maxAge: 15 * 60 * 1000 // 15 minute cache
    });

    this.client = axios.create({
      adapter: cache.adapter,
      baseURL: this.host
    });
  }

  public static get() {
    if (!PriceService.instance) {
      PriceService.instance = new PriceService();
    }

    return PriceService.instance;
  }

  public async getPrice(token = this.options.token): Promise<number> {
    const response = await this.client.get("simple/price", {
      params: {
        ids: token,
        vs_currencies: this.options.currency
      }
    });

    return response.data[token.toLowerCase()][this.options.currency.toLowerCase()];
  }

  public async getTotalPrice(amount: BigNumber, token = this.options.token) {
    const price = await this.getPrice(token);

    return amount.times(price).toFixed(2);
  }

  public async isTimesGreaterThan(amount: BigNumber, times = 1, token = this.options.token) {
    const minimum = Parser.toBN(this.options.minimumAmount);
    const totalValue = Parser.toBN(await this.getTotalPrice(amount, token));

    return totalValue.isGreaterThan(minimum.times(times));
  }
}

export default PriceService.get;
