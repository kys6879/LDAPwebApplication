//       모듈 불러오기
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const bodyParser = require('body-parser');

//       라우터 변수 설정
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/user');
const groupsRouter = require('./routes/group');
const organizationalUnitsRouter = require('./routes/orgunit');
const otherRouter = require('./routes/other');
const monitoringRouter = require('./routes/monitoring');
const adminRouter = require('./routes/admin');
const organizationRouter = require('./routes/org');
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
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//       라우팅
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/group', groupsRouter);
app.use('/ou', organizationalUnitsRouter);
app.use('/other', otherRouter);
app.use('/monitor', monitoringRouter);
app.use('/admin', adminRouter);
app.use('/org',organizationRouter);

//       404 에러 핸들링
app.use((req,res,next)=>{
  next(createError(404));
});

//       에러 핸들링
app.use((err,req,res,next)=>{
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

//       리스너
app.listen(3000,()=>{
  console.log("server is run! at 3000 port!");
});

module.exports = app;
