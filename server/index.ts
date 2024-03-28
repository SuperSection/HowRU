import "dotenv/config";
import App from "./app";
import UserRouter from "./routes/user.routes";

const PORT = process.env.SERVER_PORT;

const app = new App([new UserRouter()], PORT);

app.listen();
