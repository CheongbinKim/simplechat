var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const session = require('express-session');

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
const multer = require('multer');

var app = express();

const SECRET_PASSWORD = "znjsxja12!@";

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));


// 세션 설정
app.use(session({
  secret: 'your_secret_key', // 세션 암호화를 위한 비밀 키
  resave: false,             // 세션이 수정되지 않아도 세션을 다시 저장할지 여부
  saveUninitialized: true,   // 초기화되지 않은 세션을 저장할지 여부
  cookie: { secure: false }  // HTTPS가 아닌 경우 false로 설정
}));

app.io = function() {
  return app.get('io');
};

app.use("/", indexRouter);

// Serve the login page
app.get("/login", (req, res) => {
  res.render("login", { error: 0 });
});

// Handle login
app.post("/login", (req, res) => {
  const password = req.body.password;
  if (password === SECRET_PASSWORD) {
    res.redirect("/chat");
  } else {
    const error = req.query.error;
    res.render("login", { error: error });
  }
});

// Serve the chat page
app.get("/chat", (req, res) => {
  console.log(req.query);

  res.render("index");
  
});

app.use("/users", usersRouter);

// 파일 업로드 설정
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('file'), (req, res) => {
  console.log('upload');
  console.log(req.file);
  if (req.file) {
    const io = req.app.get('io');
    io.emit('newImage', { imageUrl: `/uploads/${req.file.filename}` });
    res.status(200).send('File uploaded successfully');
  } else {
    res.status(400).send('File upload failed');
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
