import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from "./app";

const PORT = process.env.API_GATEWAY_PORT || 7000;

app.listen(PORT, () => {
    console.log(`API Gateway running on port ${PORT}`);
});
