import {Logger} from "./log";

require('dotenv').config();
import express from 'express';
import bodyParser from "body-parser";
import {rimrafSync} from 'rimraf';
import svn from 'svn-spawn';

// create new express app and save it as "app"
const app = express();

//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

// create a route for the app
app.get('/ping', (req, res) => {
    res.send('Hello World')
});

// create a route for the app
app.get('/purgeCache', (req, res) => {
    if (!verifiedSignal(req.query.sig?.toString() ?? "")) {
        res.status(403).send("Forbidden")
    } else {
        const path = process.env[`CACHE_${req.query.sys}`]
        if (!path) {
            res.status(403).send("Sys not supported");
            return;
        }
        Logger.log(`removing ${path}`)
        const stt = rimrafSync(path, {
            glob: true
        });
        res.send(buildMessage({error: stt}))
    }
});

// create a route for the app
app.get('/updateSvn', (req, res) => {
    if (!verifiedSignal(req.query.sig?.toString() ?? "")) {
        res.status(403).send("Forbidden")
    } else {
        let svn_path = req.query.path?.toString() ?? "";
        if(req.query.type && req.query.type !== 'custom') svn_path = process.env[`SVN_${req.query.type}`] ?? ""

        if (!svn_path) {
            res.status(403).send('Invalid svn path');
        } else {
            updateSvn(svn_path, function (err, data) {
                res.send(buildMessage({
                    error: err,
                    data: data
                }))
            });
        }

    }
});

const PORT = process.env.PORT || 3000;
// make the server listen to requests
app.listen(PORT, () => {
    Logger.log(`🚀 Server running at: http://localhost:${PORT}/`);
});

const verifiedSignal = (sig: string) => sig === process.env.SIGNATURE;

const buildMessage = (obj: object) => JSON.stringify(obj);

const updateSvn = (path: string, callback: (err: Error | null, data: string) => void) => {
    let svn_client = new svn({
        cwd: path,
    });
    svn_client.update(callback);
};
