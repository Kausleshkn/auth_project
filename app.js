import express from 'express';
import connectDB from './db/connectUser.js';
import users from './routes/web.js';
import {join} from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

const app = express()
const port = process.env.port || 8000
const dataBase_URL = process.env.dataBase_URL || 'mongodb://127.0.0.1:27017'

// Connecting with Database
connectDB(dataBase_URL)

// using middleware for getting html form data
app.use(express.urlencoded({extended:false}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use(session({
    name:'logout',
    secret: 'hfbdbda64KVBJ7evbkda',
    resave: false,
    saveUninitialized: true
  }));

// setup template engine
app.set('view engine', 'ejs')

// Joining public Path
app.use(express.static(join(process.cwd(),'public')))
app.use('/edit',express.static(join(process.cwd(),'public')))
app.use('/delete',express.static(join(process.cwd(),'public')))
app.use('/logout',express.static(join(process.cwd(),'public')))
app.use('/update',express.static(join(process.cwd(),'public')))

// loading users
app.use('/',users)

app.listen(port,()=>console.log(`App lisening at http://localhost:${port}`))