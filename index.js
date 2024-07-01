const cors = require('cors');
const dotenv = require('dotenv');
const express = require('express');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/api/v1/auth');
const bookRouter = require('./routes/api/v1/books');

// Load environment variables from .env file
dotenv.config();

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(cors());
app.use('/', indexRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/books', bookRouter);

app.listen( port, () => {
    console.log(`App listening at http://localhost:${port}`);
} );
