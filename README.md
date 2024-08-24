# sout4js

Package that provide ability to advanced logging.

## Installation
#### For Node.js
```console
npm i @dxtintx/sout4js
```
#### For web
```html
<script src="https://cdn.jsdelivr.net/npm/@dxtintx/sout4js/web.js"></script>
```

## Usage
sout4js contains only 12 text output methods: 6 regular ones and the same 6, but with a larger number of arguments (Adv).

```js
trace(message)  
debug(message)  
info(message)  
warn(message)  
error(message)  
fatal(message)  

traceAdv(message, thread, module, useLegacyMethod = true)  
debugAdv(message, thread, module, useLegacyMethod = true)  
infoAdv(message, thread, module, useLegacyMethod = true)  
warnAdv(message, thread, module, useLegacyMethod = true)  
errorAdv(message, thread, module, useLegacyMethod = true)  
fatalAdv(message, thread, module, useLegacyMethod = true)  
```

#### Logger

```js
const sout4js = require("@dxtintx/sout4js")

sout4js.logger("logs", { // path to log files
  flags: "w" // default: "w"
})

// other code...
```
