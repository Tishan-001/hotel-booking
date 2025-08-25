import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from "./app";

const PORT = process.env.NOTIFICATIONS_SERVICE_PORT || 7005;

app.listen(PORT, () => {
    console.log(`Notifications service running on port ${PORT}`);
});