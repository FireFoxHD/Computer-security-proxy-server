import express from 'express';
import cors from 'cors';
import morganBody from 'morgan-body';
import { createWriteStream } from 'fs';
import 'dotenv/config';
import bodyParser from 'body-parser';
import { rateLimit } from 'express-rate-limit';
import { checkIp } from './src/middleware/ip.utils';
import { router as adminRouter } from './src/routes/admin.routes';
import { router as apiRouter } from './src/routes/api.routes';
import { router as authRouter } from './src/routes/auth.routes';
import path, { dirname } from 'path'

const app = express();
app.set('trust proxy', 1);

const logfile = new Date(Date.now()).toISOString().split('T')[0];
const corsOptions = {
  origin: true, // included origin as true
  credentials: true, // included credentials as true
};

const limiter = rateLimit({
  windowMs: 30 * 1000,
  max: 10
});

app.use(express.static('./src/public/pages'))
app.use(express.static('./src/public/assets'))
app.use(express.static('./src/public'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors(corsOptions)); // to allow cookies
morganBody(app, {
  noColors: true,
  stream: createWriteStream(`./Logs/${logfile}.log`, { flags: 'a' }),
});

// app.use(logger('common', {stream: createWriteStream(`./Logs/${logfile}.log`, {flags: 'a'})}));
app.use(checkIp);


console.log("asdfas",dirname("./public/pages/index.html"))
app.use('/', express.static(dirname("./public/pages/index.html")))
// app.use('/',(req, res) => {
//   res.send(`Your IP is: ${req.ip}`);
// });

app.use('/admin', adminRouter);
app.use('/auth', limiter, authRouter);
app.use('/api', limiter, apiRouter);

export default app;
