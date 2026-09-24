const express = require('express');
const cors = require('cors');
require('dotenv').config();

const empresasRouter = require('./routes/empresas');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', empresasRouter);

module.exports = app;