import app from "./app";

const PORT = process.env.PORT || 7004;

app.listen(PORT, () => {
    console.log(`Booking service running on port ${PORT}`);
});
