const express = require('express');
const app = express();
const server = require('http').Server(app);
const next = require('next');
const cors = require('cors');
const bodyParser = require('body-parser');
const dev = process.env.NODE_ENV != 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();
require('dotenv').config({ path: './config.env' });
const connectDB = require('./utilsServer/connectDB');
const PORT = process.env.PORT || 3000;

/*
const loginRoute = require('./api/loginRoute');
const dashboardRoute = require('./api/dashboardRoute');
const signupTwoRoute = require('./api/signupTwoRoute');
const userRoute = require('./api/userRoute');
const complainRoute = require('./api/complainRoute');
const reviewRoute = require('./api/reviewRoute');
const systemAdminRoute = require('./api/systemAdminRoute');
*/
connectDB();

app.use(cors());
app.options('*', cors());
app.use(bodyParser.json({ limit: '50mb' }));

nextApp.prepare().then(() => {
  //app.use(require('cookie-parser')); cookie not needed

  app.use('/api/v1/signup', require('./api/signupRoute'));
  app.use('/api/v1/login', require('./api/loginRoute'));
  app.use('/api/v1/user', require('./api/userRoute'));
  app.use('/api/v1/complain', require('./api/complainRoute'));
 

  app.all('*', (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Express server running on ${PORT}`);
  });
});
