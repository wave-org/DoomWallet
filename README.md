# Doom Wallet

Doom Wallet is a mobile cold wallet. You can use it to secure your private keys and sign transactions offline. It's supposed to be used in a dedicated offline device.

You need to use Doom Wallet with an online wallet, like [MetaMask](https://metamask.io/), to send transactions to the network. You can use the QR code scanner to scan the transaction data from the online wallet, sign it and send it back to the online wallet.

## Download

<a href="https://apps.apple.com/us/app/doom-wallet/id6455836435?itsct=apps_box_badge&amp;itscg=30200" style="display: inline-block; overflow: hidden; border-radius: 13px; width: 250px; height: 83px; margin: 20px;"><img src="https://tools.applemediaservices.com/api/badges/download-on-the-app-store/black/en-us?size=250x83&amp;releaseDate=1691020800" alt="Download on the App Store" style="border-radius: 13px; width: 250px; height: 83px;"></a>

<a href='https://play.google.com/store/apps/details?id=org.wave.doom&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1'><img alt='Get it on Google Play' src='https://play.google.com/intl/en_us/badges/static/images/badges/en_badge_web_generic.png' style="width: 290px;"/></a>

<a href="https://github.com/wave-org/DoomWallet/releases/latest" style="display: inline-block; overflow: hidden; border-radius: 13px; width: 250px; height: 83px; margin: 20px;"><img src="./docs/apk.svg" alt="Download Android APK" style="border-radius: 13px; width: 250px; height: 83px;"></a>

## Why Doom Wallet?

#### 1. Open source and react native

Doom Wallet is open source and built with react native. You can check the code and build it yourself.

#### 2. Free

Doom Wallet is free. You can use it without paying anything.

#### 3. Secure

Doom Wallet can be used on iOS or Android devices. It's safer than other hardware wallets. You can use Biometrics (FaceID or TouchID) to store your private keys. No one can access your private keys without your Biometrics. However, some specific versions of iOS or Android may not be secure enough. Generally, hardware wallets cannot compete with iOS or Android devices regarding security.

#### 4. Easy to use

Doom Wallet is easy to use. We are aiming to make a user-friendly wallet.

## Why Doom?

Because we think the hardware wallets are useless. We want to make a free and open-source cold wallet for everyone. Doom Wallet will doom the hardware wallets.

## Password(passphrase)

In Doom Wallet, a private key is generated by a 24-words mnemonic and a password. Without the password, you cannot get the private key.

So, when you back up your wallet, you should back up the mnemonic and the password in different places.

## Supported Chains

- Bitcoin
- Ethereum
- Binance Smart Chain
- EVM-compatible chains: Polygon, Fantom, Avalanche, etc. Not tested yet. If you meet any problems, please open an issue.

We will support Bitcoin and other chains in the future.

## Support

- You can join our [Telegram group](https://t.me/doomvault) to get help.
- You can also contact us by email [info@prosurfer.net](mailto:info@prosurfer.net)
- Please open an [issue](https://github.com/wave-org/DoomWallet/issues) if you want to report problems or bugs or request a new feature.

## How to use Doom Wallet?

- [Create a new wallet](./docs/create.md)
- [Import and Export](./docs/import.md)
- [EVM wallet with MetaMask](./docs/evm.md)
- [Bitcoin wallet with BlueWallet](./docs/btc.md)
