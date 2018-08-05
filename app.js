//       모듈 불러오기
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local').Strategy;

const ldap_authenticate = require('./library/ldap_authenticate');

//       라우터 변수 설정
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const groupsRouter = require('./routes/group');
const organizationalUnitsRouter = require('./routes/ou');
const otherRouter = require('./routes/other');
const monitoringRouter = require('./routes/monitoring');
const adminRouter = require('./routes/admin');
const organizationRouter = require('./routes/org');
const optionRouter = require('./routes/option');
const createRouter = require('./routes/create');
const app = express();

//       템플릿 엔진 설정
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//       미들웨어 설정
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(session({
  secret: '32453425@%#@%#!%',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser( (user, done) => {
  console.log(`serializeUser :  ${user.cn}`);
  done(null, user.cn);
});

passport.deserializeUser( (id, done) => {
  console.log(`deserializeUser : ${id}`);
  done(null,id);
});

passport.use(new LocalStrategy({
  passReqToCallback : true
}, (req,username, password, done) => {
  let user = {
    cn : username,
    password : password,
    ou : req.body.ou
  };
    ldap_authenticate.authenticate(user.cn,user.password,user.ou).then(()=>{
      console.log("인증성공");
      return done(null, user);
    },(err) =>{
      console.log("인증실패");
      return done(null, false);
    });
}));


//       라우팅
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/group', groupsRouter);
app.use('/ou', organizationalUnitsRouter);
app.use('/other', otherRouter);
app.use('/monitor', monitoringRouter);
app.use('/admin', adminRouter);
app.use('/org', organizationRouter);
app.use('/option', optionRouter);
app.use('/create', createRouter);

//       404 에러 핸들링
app.use((req, res, next) => {
  next(createError(404));
});

//       에러 핸들링
app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

//       리스너
app.listen(3000, () => {
  console.log("서버 시작");
});

module.exports = app;
