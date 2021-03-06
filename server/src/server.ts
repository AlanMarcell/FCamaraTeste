import express = require('express');
import BaseRoutes = require('./config/routes/Routes');
import bodyParser = require('body-parser');
import morgan = require('morgan');

import path = require('path');
const port: number = process.env.PORT || 3000;
const env: string = process.env.NODE_ENV || 'developement';

const app = express();

app.set('port', port);

app.use('/app', express.static(path.resolve(__dirname, '../client/app')));
app.use('/libs', express.static(path.resolve(__dirname, '../client/libs')));

// for system.js to work. Can be removed if bundling.
app.use(express.static(path.resolve(__dirname, '../client')));
app.use(express.static(path.resolve(__dirname, '../../node_modules')));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use('/api', new BaseRoutes().routes);

const renderIndex = (req: express.Request, res: express.Response) => {
    res.sendFile(path.resolve(__dirname, '../client/index.html'));
};

app.get('/*', renderIndex);

if (env === 'developement') {
    app.use(function (err, req: express.Request, res: express.Response, next: express.NextFunction) {
        res.status(err.status || 500);
        res.json({
            error: err,
            message: err.message
        });
    });
}

// catch 404 and forward to error handler
app.use(function (req: express.Request, res: express.Response, next) {
    const err = new Error('Not Found');
    next(err);
});

// production error handler
// no stacktrace leaked to user
app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
    res.status(err.status || 500);
    res.json({
        error: {},
        message: err.message
    });
});

export { app }
