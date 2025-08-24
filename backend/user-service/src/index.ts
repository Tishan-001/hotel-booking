import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from "./app";

const PORT = process.env.USER_SERVICE_PORT || 7002;

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
