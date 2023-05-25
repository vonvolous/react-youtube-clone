// index.js는 백엔드의 시작점이다.

// express 모듈 가져옴
const express = require('express')
// express 앱 생성
const app = express()

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');
const { auth } = require('./middleware/auth');
const { User } = require("./models/User");

// application/x-www-form-urlencoded를 client-> server로 분석해 가져옴
app.use(bodyParser.urlencoded({extended: true}));

// application/json을 분석해 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

// mongoose 모듈 가져옴
const mongoose = require('mongoose')

// mongodb 연결
mongoose.connect(config.mongoURI,{}
).then(() => console.log('MongoDB Connected...')).catch(err => console.log(err))

// root 디렉토리에 hello world 출력
app.get('/', (req, res) => {
  res.send('Hello World! 안녕하세요 반가워요')
})

app.get('/api/hello', (req, res) => {
    res.send('안녕하세요 ~')
})

//app.post(endpoint, callback function), 회원가입 기능
app.post('/api/users/register', (req, res) => {
    //회원 가입시 필요한 정보를 client에서 가져오면
    //그것들을 db에 넣어준다.

    // bodyParser이용해 정보를 받아 user에 저장
    const user = new User(req.body)

    //mongodb 메소드 user에 저장
    user.save().then(() => {
        res.status(200).json({
            success: true
        })
    }).catch((err) => {
        return res.json({ success: false, err })
    })
})

//로그인 기능 구현
app.post('/api/users/login', (req, res) => {
    //1. 요청된 이메일을 db에서 있는지 찾는다
    User.findOne({ email: req.body.email }).then( user => {
        if(!user) {
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }

        //2. 요청된 이메일이 db에 있다면 비밀번호가 맞는지 확인
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch)
                return res.json({ 
                    loginSuccess: false, 
                    message: "비밀번호가 틀렸습니다." })
            
            //3. 비밀번호가 맞다면 토큰 생성하기
            user.generateToken((err, user) => {
                if(err) return res.status(400).send(err);

                //토큰을 저장한다, 어디에? 쿠키 or 로컬 스토리지
                res.cookie("x_authExp", user.tokenExp)
                res.cookie("x_auth", user.token)
                .status(200)
                .json({ loginSuccess: true, userId: user._id })
            })
        })
    }).catch((err) => {
        return res.status(400).send(err);
    })
})

//AUTH 기능 구현, role0: 일반 유저 / role0아니면 관리자
app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어 통과해 왔다는 얘기는 Authentication이 참이라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

//로그아웃 기능 구현
app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate({_id: req.user._id}, {token: ""}).then(() => {
        res.status(200).send({
            success: true
        })
    }).catch((err) => {
        res.json({success:false, err});
    })
})

//use this to show the image you have in node js server to client (react js)
//https://stackoverflow.com/questions/48914987/send-image-path-from-node-js-express-server-to-react-client
app.use('/uploads', express.static('uploads'));

// port에서 앱 실행
// 특정 포트 백서버로 둠
const port = process.env.PORT || 8080

// Request failed with status code 500 AxiosError
const path = require("path");

// production mode
if(process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
  
    app.get("*", (req, res) => {
      // path는 여기에서만 사용되었다.
      res.sendFile(path.join(__dirname, "../client/build/index.html"))
    })
  }

app.listen(port, () => {
  console.log(`Server Running at port ${port}`)
})

// package.json의 script에 start로 node index.js 추가후
// 터미널에서 npm start로 실행 or npm run backend
//$ killall -9 node 사용: error listen edadrinuse address already in use
// mongodb timeout error: google DNS 로 변경해주기