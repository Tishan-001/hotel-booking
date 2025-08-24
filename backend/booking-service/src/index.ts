import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import app from "./app";

const PORT = process.env.BOOKING_SERVICE_PORT || 7004;

app.listen(PORT, () => {
    console.log(`Booking service running on port ${PORT}`);
});
