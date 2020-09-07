# Compendia Core - True Block Weight Core Plugin

<p align="center">
    <img src="./.github/bindie-pog-wallet-2.png" alt="bindie" width="250"/>

> A Twitter & Telegram bot announcing Big $BIND stakes and daily stake reports - Created By Compendia Validator Bindie

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Support

Do you like Bindie's True Block Weight Core Plugin or thought this public repository was useful?

Consider giving validator **[Bindie](https://bindscan.io/wallets/bindie)** a vote on the Compendia Network.

Don't have a vote? We're always open for $BIND donations to `cU3kVS8sgH4E4hcyaUEQ6DtxwJo2Y4L8iP`

## Credits
- [Bindie Dev](https://t.me/BindieDev) - [Owner of the Bindie Validator](https://bindscan.io/wallets/bindie)
  - [Bindie Website](https://bindie.io/)

## Installation

#### Configuration required for path ~/.config/compendia-core/network-name/plugins.js

```javascript
module.exports = {
    // Any other plugins ..
    "@robovalidators/tbw-core": {
        startHeight: 0, // Heigh to start from
        validator: {
            name: "bindie", // Your validator name
            publicKey: "032dc97447a17a85aaa20b262ea482681bed867a905b7c61487bc506a7b939bbc5", // Your validator public key
            payoutAddress: "cU3kVS8sgH4E4hcyaUEQ6DtxwJo2Y4L8iP", // The address you'd like to receive your validator cut on
            sharePercentage: 99 // The share percentage of your validator
        }
    },
    // Any other plugins ..
};
```

```bash
# Navigate to plugins folder
cd ~/compendia-core/plugins/

# Clone repo
git clone https://github.com/RoboValidators/tbw-core

# Install deps
cd tbw-core && yarn

# Create serviceAccountKey file
touch serviceAccountKey.json

# Copy FireBase secrets to the serviceAccountKey file
# Secrets can be found in Project Settings -> Service Accounts
nano serviceAccountKey.json

# Build the project
yarn build

# Start the validator/relay
ccontrol start relay | forger | core

# If you see ============== TBW-CORE ==============
# in your logs during startup, everything is set and done!

```

## Check out the Bindie Stake report Bots

- [Bindie Telegram stake bot](https://t.me/CompendiaStakes)
- [Bindie Twitter stake bot](https://twitter.com/BindieBot)

## Security

If you discover a security vulnerability within this package, please send an e-mail to hello@bindie.io. All security vulnerabilities will be promptly addressed.

## License

[MIT](LICENSE) © [RoboValidators](https://bindie.io/)
