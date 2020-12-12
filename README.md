# The Cool Project

The Cool project is a really cool project. It allows to create uncollaterallized loans on top of Aave V2 for impactful project that aim to make the planet great again.

## Web App

```bash
cd wep-app
# and
npm run dev
# or
yarn dev
```

## Truffle

To deply contract on Kovan network
```bash
cd truffle
# and
npm run migrate:kovan
```

Then, update the addresses and abis in the `contracts` folder in `web-app`.

## TODO

Short terms:
- Create forms to to whitelist someone.
- Update SC to allow someone to borrow.


Long terms:
- Implement conviction voting to whitelist new borrowers.
- Allow projects to run for being whitelisted.