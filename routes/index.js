const express = require('express')
const router = express.Router()
const qs = require('querystring');
const template = require('../lib/template.js');

router.get('/', function(request, response) {  
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

module.exports = router;