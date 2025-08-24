import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from "./app";

const PORT = process.env.HOTEL_SERVICE_PORT || 7003;

app.listen(PORT, () => {
    console.log(`Hotel service running on port ${PORT}`);
});
