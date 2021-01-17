const path = require('path');
const fs = require('fs');
const template = require('./lib/template.js');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const bodyParser = require('body-parser')
const compression = require('compression')
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

// 예전 문법
app.get('/', function(request, response) {  
  // 화면의 홈 부분
  let title = 'Welcome';
  let description = 'Hello, Node.js';
  let list = template.list(request.list);
  let html = template.HTML(title, list,
    `<h2>${title}</h2>${description}
    <img src="/images/hello.jpg" style="width:300px; height:300px; display:block; margin-top:10px;"> `,
    // 메인 페이지에 hello 이미지 넣기
    `<a href="/topic/create">create</a>`
    );
    response.send(html);
});

// 페이지 생성
app.get('/topic/create', function(request, response){
  let title = 'WEB - create';
  let list = template.list(request.list);
  let html = template.HTML(title, list, `
  <form action="/topic/create_process" method="post">
  <p>
    <input type="text" name="title" placeholder="title">
  </p>
  <p>
    <textarea name="description" placeholder="description"></textarea>
  </p>
  <p>
    <input type="submit">
  </p>
</form>
`, '');
// create 부분 만들기(url, 요청)
  response.send(html);
});

// 페이지 생성 POST 방식
app.post('/topic/create_process', function(request, response){
  
  /*
  let body = '';
    request.on('data', function(data){
        // 웹 브라우저가 POST방식으로 전송할 떄 data의 양이 많으면 함수 호출하도록 약속
      body = body + data;
    });
    request.on('end', function(){
      // 들어올 정보가 더 이상 없으면 정보 수신 끝
      let post = qs.parse(body);
      let title = post.title;
      let description = post.description;
      // 제목과 내용 업로드
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) { // err가 있을 경우 처리 방식
        response.writeHead(302, {Location: `/?id=${title}`});
        response.end();
      });
    });
  */
 
  let post = request.body;
  let title = post.title;
  let description = post.description;
  console.log(request.list)
  // 제목과 내용 업로드
  fs.writeFile(`data/${title}`, description, 'utf8', function(err) { // err가 있을 경우 처리 방식
    response.redirect(`/topic/${title}`);
  });
});

// 페이지 업데이트
app.get('/topic/update/:pageId', function(request, response){
  const filteredId = path.parse(request.params.pageId).base; // security
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    let title = request.params.pageId;
    let list = template.list(request.list);
    let html = template.HTML(title, list,
      //hidden으로 하여 id 값을 받고 변경된 title을 삽입
      `
      <form action="/topic/update_process" method="post">
        <input type="hidden" name="id" value="${title}">
        <p>
          <input type="text" name="title" placeholder="title" value="${title}">
        </p>
        <p>
          <textarea name="description" placeholder="description">${description}</textarea>
        </p>
        <p>
          <input type="submit">
        </p>
      </form>
      `,
      `<a href="/topic/create">create</a> <a href="/topic/update/${title}">update</a>`
      );
      // 업데이트 시 선택한 제목과 내용에 대하여 불러와 title, description text 박스에 보이기
      response.send(html);
  });
});

app.post('/topic/update_process', function(request, response){
    let post = request.body;
    let id = post.id;
    let title = post.title;
    let description = post.description;
    fs.rename(`data/${id}`, `data/${title}`, function(error){
      // 제목과 내용 수정 업로드
      fs.writeFile(`data/${title}`, description, 'utf8', function(err) { // err가 있을 경우 처리 방식
        response.redirect(`/topic/${title}`);
    })
  });
});

app.post('/topic/delete_process', function(request,response){
    let post = request.body;
    let id = post.id;
    const filteredId = path.parse(id).base; // security
    // unlink로 삭제
    fs.unlink(`data/${filteredId}`, function(error){
      response.redirect(`/`);
  });
});

// 상세 페이지 구현
// Route parameters - express
app.get('/topic/:pageId', function(request, response, next) {
  // console.log(request.list)
  // key : value 방식
  const filteredId = path.parse(request.params.pageId).base; // security
  fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
    if(err){
      next(err);
    } else{
      let title = request.params.pageId;
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDescroption = sanitizeHtml(description);
      let list = template.list(request.list);
      let html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescroption}`,
        `<a href="/topic/create">create</a>
        <a href="/topic/update/${sanitizedTitle}">update</a>
        <form action="/topic/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`
        );
        // /update?id= -> /update/ 변경
        // delete_process 부분에 /delete_process 로 변경
        response.send(html);
    }
  });
});



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