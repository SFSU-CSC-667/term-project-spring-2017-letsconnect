## Table of Contents
+ [Running this project](#run)
  + [List of Node Modules utilized](#list)


## Running this project <a name="run"></a>

```
git clone https://github.com/almondmilk/connectfour.git
cd connectfour
npm install
npm run build
npm run start
open localhost:3000
```

### List of Node Modules utilized <a name="list"></a>
```
body-parser           https://www.npmjs.com/package/body-parser
bootstrap-validator   https://www.npmjs.com/package/bootstrap-validator
connect-four          https://www.npmjs.com/package/connect-four
connect-pg-simple     https://www.npmjs.com/package/connect-pg-simple
cookie-parser         https://www.npmjs.com/package/cookie-parser
debug                 https://www.npmjs.com/package/debug
express               https://www.npmjs.com/package/express
express-session       https://www.npmjs.com/package/express-session
moment                https://www.npmjs.com/package/moment
morgan                https://www.npmjs.com/package/morgan
pg                    https://www.npmjs.com/package/pg
pug                   https://www.npmjs.com/package/pug
serve-favicon         https://www.npmjs.com/package/serve-favicon
socket.io             https://www.npmjs.com/package/socket.io
```

I did some fancy where I wanted to make some code accessible to both front and back ends, so I used [browserify](http://browserify.org/) to create a frontend bundle.  Would love questions, PRs to improve (add rooms, for example), and comments!
