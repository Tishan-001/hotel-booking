import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from "./app";

const PORT = process.env.AUTH_SERVICE_PORT || 7001;

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
