# Compendia Core - Power Poster

<p align="center">
    <img src="./.github/Bindie-announce.png" alt="bindie" width="125"/>


> A Twitter & Telegram bot announcing Big $BIND stakes and daily stake reports - Created By Compendia Validator Bindie

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## Support

Do you like Bindie's stake reports or thought this public repository was useful?

Consider giving validator **[Bindie](https://bindscan.io/wallets/bindie)** a vote on the Compendia Network.

Don't have a vote? We're always open for $BIND donations to `cU3kVS8sgH4E4hcyaUEQ6DtxwJo2Y4L8iP`

## Check out the Bindie Bots in production

- [Bindie Telegram stake bot](https://t.me/CompendiaStakes)
- [Bindie Twitter stake bot](https://twitter.com/BindieBot)

## Credits
- [Bindie Dev](https://t.me/BindieDev) - [Owner of the Bindie Validator](https://bindscan.io/wallets/bindie)
  - [Bindie Website](https://bindie.io/)

## Installation

#### Configuration required for path ~/.config/compendia-core/network-name/plugins.js

```javascript
module.exports = {
    // AFTER @arkecosystem/core-api & @arkecosystem/core-wallet-api
    "@robovalidators/power-poster": {
        telegram: {
            token: "", // Telegram token (obtained from @BotFather)
            channelId: "" // ID of the telegram channel you want to announce in
        },
        twitter: {
            consumerKey: "", // Twitter API key
            consumerSecret: "", // Twitter API secret
            accessKey: "", // Twitter User Access Key
            accessSecret: "" // Twitter User Access Secret
        },
        minimumAmount: 0, // Minimum amount of USD to announce as a "whale"-post
        startHeight: 0, // Heigh to start the announcements from
        txUrl: "https://bindscan.io/transactions", // API endpoint for transactions
        token: "BIND", // Token you want to use (used in price API call)
        currency: "USD", // Token value currency you want to query and post
        cron: "0 18 * * *" // The cron expression used for the accumulative stake reports
    },
    // Any other plugins ..
};
```
As a tip, check your expressions here to verify they are correct: [cron expression generator](https://crontab.cronhub.io/)

```bash
# Install Redis
sudo apt update
sudo apt install redis-server

# Enable redis on system reboots
sudo systemctl enable redis-server

# Navigate to plugins folder
cd ~/compendia-core/plugins/

# Clone repo
git clone https://github.com/RoboValidators/power-poster

# Install deps
cd power-poster && yarn

# Create serviceAccountKey file
touch serviceAccountKey.json

# Copy FireBase secrets to the serviceAccountKey file
# Secrets can be found in Project Settings -> Service Accounts
nano serviceAccountKey.json

# Build the project
yarn build

# Start the validator/relay
ccontrol start relay | forger | core

# If you see ============== POWER-POSTER ==============
# in your logs during startup, everything is set and done!
# **NOTE** The log will only appear AFTER syncing due to plugin order

```

## Security

If you discover a security vulnerability within this package, please send an e-mail to hello@bindie.io. All security vulnerabilities will be promptly addressed.

## License

[MIT](LICENSE) © [RoboValidators](https://bindie.io/)
