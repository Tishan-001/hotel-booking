import app from "./app";

const PORT = process.env.PORT || 7001;

app.listen(PORT, () => {
    console.log(`Auth service running on port ${PORT}`);
});
