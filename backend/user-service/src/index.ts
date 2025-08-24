import app from "./app";

const PORT = process.env.PORT || 7002;

app.listen(PORT, () => {
    console.log(`User service running on port ${PORT}`);
});
