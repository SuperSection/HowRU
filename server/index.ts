import app from "./app";

const PORT = process.env.NODE_ENV || 5000;


app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
