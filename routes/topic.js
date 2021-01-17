const express = require('express')
const router = express.Router()
const path = require('path');
const fs = require('fs');
const sanitizeHtml = require('sanitize-html');
const template = require('../lib/template.js');

// 페이지 생성
router.get('/create', function(request, response){
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
router.post('/create_process', function(request, response){
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
router.get('/update/:pageId', function(request, response){
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

router.post('/update_process', function(request, response){
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

router.post('/delete_process', function(request,response){
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
router.get('/:pageId', function(request, response, next) {
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

module.exports = router;