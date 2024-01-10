/* eslint-disable no-console */
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const router = require('./src/router');

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());

const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};

app.use(cors(corsOptions));

app.use(cookieParser());

app.use(router);

const { PORT } = process.env;

let server;

// Start the server only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`App running at http://localhost:${PORT}`);
  });
}

module.exports = app;
