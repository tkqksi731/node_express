const path = require('path');
const fs = require('fs');
const template = require('./lib/template.js');
const sanitizeHtml = require('sanitize-html');
const qs = require('querystring');
const express = require('express')
const app = express()
const port = 3000

// route, touting
// 최신 문법
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

// 예전 문법
app.get('/', function(request, response) {
  fs.readdir('./data', function(error, filelist){
    // 화면의 홈 부분
    let title = 'Welcome';
    let description = 'Hello, Node.js';
    let list = template.list(filelist);
    let html = template.HTML(title, list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
      );
      response.send(html);
    });
});

// 상세 페이지 구현
// Route parameters - express
app.get('/page/:pageId', function(request, response) {
  // key : value 방식
  fs.readdir('./data', function(error, filelist){
    const filteredId = path.parse(request.params.pageId).base; // security
    fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
      let title = request.params.pageId;
      let sanitizedTitle = sanitizeHtml(title);
      let sanitizedDescroption = sanitizeHtml(description);
      let list = template.list(filelist);
      let html = template.HTML(sanitizedTitle, list,
        `<h2>${sanitizedTitle}</h2>${sanitizedDescroption}`,
        `<a href="/create">create</a>
        <a href="/update/${sanitizedTitle}">update</a>
        <form action="/delete_process" method="post">
          <input type="hidden" name="id" value="${sanitizedTitle}">
          <input type="submit" value="delete">
        </form>`
        );
        // /update?id= -> /update/ 변경
        // delete_process 부분에 /delete_process 로 변경
        response.send(html);
    });
  });
});

// 페이지 생성
app.get('/create', function(request, response){
  fs.readdir('./data', function(error, filelist){
      let title = 'WEB - create';
      let list = template.list(filelist);
      let html = template.HTML(title, list, `
      <form action="/create_process" method="post">
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
});

// 페이지 생성 POST 방식
app.post('/create_process', function(request, response){
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
        response.redirect(`/page/${title}`);
      });
    });
});

// 페이지 업데이트
app.get('/update/:pageId', function(request, response){
  fs.readdir('./data', function(error, filelist){
      const filteredId = path.parse(request.params.pageId).base; // security
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        let title = request.params.pageId;
        let list = template.list(filelist);
        let html = template.HTML(title, list,
          //hidden으로 하여 id 값을 받고 변경된 title을 삽입
          `
          <form action="/update_process" method="post">
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
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
          );
          // 업데이트 시 선택한 제목과 내용에 대하여 불러와 title, description text 박스에 보이기
          response.send(html);
      });
    });
});

app.post('/update_process', function(request, response){
        let body = '';
      request.on('data', function(data){
          // 웹 브라우저가 POST방식으로 전송할 떄 data의 양이 많으면 함수 호출하도록 약속
        body = body + data;
      });
      request.on('end', function(){
        // 들어올 정보가 더 이상 없으면 정보 수신 끝
        let post = qs.parse(body);
        let id = post.id;
        let title = post.title;
        let description = post.description;
        fs.rename(`data/${id}`, `data/${title}`, function(error){
          // 제목과 내용 수정 업로드
          fs.writeFile(`data/${title}`, description, 'utf8', function(err) { // err가 있을 경우 처리 방식
            response.redirect(`/page/${title}`);
          })
        })
        // console.log(post);
      
      });
});

app.post('/delete_process', function(request,response){
  // nodejs express redirect search
  let body = '';
    request.on('data', function(data){
        // 웹 브라우저가 POST방식으로 전송할 떄 data의 양이 많으면 함수 호출하도록 약속
      body = body + data;
    });
    request.on('end', function(){
      // 들어올 정보가 더 이상 없으면 정보 수신 끝
      let post = qs.parse(body);
      let id = post.id;
      const filteredId = path.parse(id).base; // security
      // unlink로 삭제
      fs.unlink(`data/${filteredId}`, function(error){
        response.redirect(`/`);
      })
    });
});

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