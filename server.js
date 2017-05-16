const path = require('path');
const express = require('express');
const kurentoServer = require('./server/kurentoServer');
const app = express();

kurentoServer(app);
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, './client')));
