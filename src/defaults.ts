export const defaults = {
  telegram: {
    token: "",
    channelId: ""
  },
  twitter: {
    consumerKey: "",
    consumerSecret: "",
    accessKey: "",
    accessSecret: ""
  },
  minimumAmount: 0,
  startHeight: 0,
  txUrl: "https://bindscan.io/transactions",
  token: "BIND",
  currency: "USD",
  cron: "0 18 * * *",
  validator: {
    name: "bindie",
    publicKey: "032dc97447a17a85aaa20b262ea482681bed867a905b7c61487bc506a7b939bbc5"
  }
};

export const alias = "tbw-core";
