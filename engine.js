const express = require('express'),
      bodyParser = require('body-parser'),
      logger = require('morgan'),
      path = require('path'),
      cors=require('cors'),
      app = express(),
      PORT = process.env.PORT || 8080,  //Setting port
      NODE_ENV = process.env.NODE_ENV || 'development';  //Setting the environment

//Cnnfiguring the server with port & env
app.set('port', PORT);
app.set('env', NODE_ENV);

//Abilities associating with server
app.use(logger('tiny'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//Finding the api routes
app.use(cors());
app.use('/', require(path.join(__dirname, 'credit-card-routes')));
//Loging the exceptions
app.use((req, res, next) => {
  const err = new Error(`${req.method} ${req.url} Not Found`);
  err.status = 404;
  next(err);
});

//Default exception logger
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

// app.use(cors({origin: '*'}));
// app.use(cors({origin: 'http://localhost:3002/'}));

//Listening the port
app.listen(PORT, () => {
  console.log(
    `Express Server started on Port 
    ${app.get('port')} | Environment : ${app.get('env')}`);
});
