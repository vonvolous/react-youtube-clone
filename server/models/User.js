const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const saltRounds = 10
const jwt = require('jsonwebtoken');
const moment = require('moment');

const userSchema = mongoose.Schema({
    name:{
        type: String,
        maxlength: 50
    },
    email:{
        type: String,
        trim: true, //WhiteSpace 없애주는 역할함
        unique: 1 //이메일 중복 허용 안함
    },
    password: {
        type: String,
        minlength: 5
    },
    lastname: {
        type: String,
        maxlength: 50
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: { // 토큰 유효기간
        type: Number
    }
})


// save하기 전에 하는 기능
userSchema.pre('save', function( next ) {
    var user = this;

    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다.
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function(err, hash) {
                if (err) return next(err);
                user.password = hash
                next()
            })
        })
    } else {
        next()
    }
})

userSchema.methods.comparePassword = function(plainPassword, cb) {
    // plainPassword : 1234567 , 암호화된 비밀번호 : $2a$10$Q09NQ22QmPvzTLliJApUquVsPMpGKwPDkWJR7OdtwpDEMmt9QFbuq
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    })
}

userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsonwebtoken 이용해서 트큰을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    var oneHour = moment().add(1, 'hour').valueOf();

    user.tokenExp = oneHour;
    user.token = token
    user.save().then(() => {
        cb(null, user);
    }).catch((err) => {
        return cb(err);
    })
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;

    //토큰 decoding
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용해 유저를 찾은 다음
        //클라이언트에서 가져온 token과 db에 보관된 토큰이 일치하는지 확인
        user.findOne({ "_id": decoded, "token": token }).then(user=>{
            cb(null,user)
        }).catch((err)=>{
            return cb(err);
        })
    })
}

const User = mongoose.model('User', userSchema)

//다른 곳에서도 User 모델 사용할 수 있게 export함
module.exports = { User }