import app from "./app";

const PORT = process.env.PORT || 7003;

app.listen(PORT, () => {
    console.log(`Hotel service running on port ${PORT}`);
});
