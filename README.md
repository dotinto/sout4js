# sout4js

Package for convenient logging of any information to the console with Log4j format for JavaScript.

## Installation
#### For Node.js
`npm i @dxtintx/sout4js`
#### For web
`<script src="https://cdn.jsdelivr.net/npm/@dxtintx/sout4js@2.0.0/web.js"></script>`

## Usage
sout4js contains only 12 text output methods: 6 regular ones and the same 6, but with a larger number of arguments (Adv).

`trace(message)`  
`debug(message)`  
`info(message)`  
`warn(message)`  
`error(message)`  
`fatal(message)`  

`traceAdv(message, thread, module)`  
`debugAdv(message, thread, module)`  
`infoAdv(message, thread, module)`  
`warnAdv(message, thread, module)`  
`errorAdv(message, thread, module)`  
`fatalAdv(message, thread, module)`  

#### Logger

```js
const sout4js = require("@dxtintx/sout4js")

sout4js.logger("logs", { // path to log files
  flags: "w" // default: "w"
})

// other code...
```
