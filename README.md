# node_express

1. express 기본 설치 및 세팅

- 기존에 공부했던 코드 가져와서 세팅함

```cmd
npm install
```

모듈 재설치

```cmd
npm install sanitize-html
```

sanitize 설치

---

## pm2

```cmd
pm2 start filename
```

파일 실행

```cmd
pm2 start main.js --watch --ignore-watch="data/* sessions/*"  --no-daemon
```

pm2를 실행하면서 로그가 출력되도록 합니다. (--no-daemon) 또 특정 디랙토리에 대한 watch를 하지 않도록 하는 방법

---

## EXPRESS

1. Hello Word
2. 홈페이지 구현
3. 상세 페이지 구현
4. 페이지 생성 구현
5. 페이지 수정 구현
6. 페이지 삭제 구현
7. 미들웨어의 사용 body parser
   - npm install body-parser - 패키지 설치
   - const bodyParser = require('body-parser') - 패키지 호출
   - request.body
8. 미들웨어의 사용 compression
   - npm install compression
   - app.use(compression())
9. 정적인 파일의 서비스
   - app.use(express.static('public'));
