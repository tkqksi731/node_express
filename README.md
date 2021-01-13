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
