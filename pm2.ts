import * as fs from "node:fs";
import {Logger} from "./src/log";

require('dotenv').config();
const log_dir = `${process.env.LOG_DIR}/remote_request_server.log`;
const json_file = "pm2-generated.json";
const app = {
    apps: [{
        name: 'Remote Request Server',
        script: process.env.NPM,
        args: "run start",
        cwd: __dirname,
        out_file: log_dir,
        error_file: log_dir,
    }],
};
fs.writeFileSync(json_file, JSON.stringify(app, null, 2));
Logger.log(`Wrote to ${json_file}`);