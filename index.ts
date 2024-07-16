//sources:
// - https://services.swpc.noaa.gov/json/
import express, {Express} from 'express';
import dotenv from 'dotenv';

import {rtsw_wind_1m} from './cron/rtsw_wind_1m';

dotenv.config();
const PORT = 50142
const server: Express = express();


()(async () => {
    await rtsw_wind_1m();
})();


server.listen( PORT, () => console.log(`📈 Listening on port: ${PORT}`) );
