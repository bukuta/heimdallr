# Heimdallr

> This is a project same as swaggerui, with additional support of sorting and filtering
> Make life better

## Environment

`Node >= 8`

## usage
```bash
heimdallr preview dist/index.json # cli alone

let heimdallr = require('heimdallr');
let p = heimdallr.getStaticPath();
app.use('/preview',express.staticMiddleware(p));
```

## Start

 - Clone or download this repository
 - Enter your local directory, and install dependencies:

``` bash
yarn
// else
npm install
```

## Scripts

``` bash
"scripts": {
  "dev": "node build/dev-server.js",
  "build": "node build/build.js",
  "lint": "eslint --fix --ext .js,.vue src"
},
```

