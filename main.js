const fs = require('fs');
const bodyParser = require('body-parser')
const compression = require('compression')
const topicRouter = require('./routes/topic.js')
const indexRouter = require('./routes/index.js')
const helmet = require('helmet')
const express = require('express')
const app = express()
const port = 3000

// route, touting
// 최신 문법
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// parse application/x-www-form-urlencoded
app.use(express.static('public'));
// 이미지 파일 가져오기 디렉토리 위치 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(compression());
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    next();
  });
});
app.use('/', indexRouter)
// index
app.use('/topic', topicRouter)
// topic 폴더에 기존 CUD 코드를 옮김 파일 분리
app.use(helmet())

app.use(function(req, res, next) {
  res.status(404).send('Sorry cant find that!');
});

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

// const http = require('http');
// const fs = require('fs');
// const url = require('url');
// const qs = require('querystring');
// const template = require('./lib/template.js');
// // nodejs path parse search
// const path = require('path');
// const sanitizeHtml = require('sanitize-html');

// const app = http.createServer(function(request,response){
//     // request 요청할 때 웹 브라우저가 보낸 정보
//     // response 응답할 때 우리가 웹 브라우저에 전송할 정보
//     const _url = request.url;
//     const queryData = url.parse(_url, true).query;
//     const pathname = url.parse(_url, true).pathname;
//     // console.log(pathname);
//     if(pathname === '/'){
//       if(queryData.id === undefined){
//       } 
//       }
//     } else if(pathname === '/create'){
//     } else if(pathname === '/create_process') {
//     } else if(pathname === '/update'){
//       // nodejs file write search
//     } else if(pathname === '/update_process') {
//       });
//       // Nodejs delete file search
//     } else if(pathname === '/delete_process') {
//     } else {
//       response.writeHead(404);
//       response.end('Not found');
//     }
// });
// app.listen(3000);