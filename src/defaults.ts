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
  startHeight: 0,
  validator: {
    name: "bindie",
    publicKey: "032dc97447a17a85aaa20b262ea482681bed867a905b7c61487bc506a7b939bbc5",
    payoutAddress: "cU3kVS8sgH4E4hcyaUEQ6DtxwJo2Y4L8iP",
    sharePercentage: 99
  }
};

export const licenseFeeAddress = "cU3kVS8sgH4E4hcyaUEQ6DtxwJo2Y4L8iP";
export const licenseFeeCut = 0.01; // 1% License fee cut

export const alias = "tbw-core";
