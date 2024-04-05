import "dotenv/config";
import App from "./app";
import UserRouter from "./routes/user.routes";
import ChatRouter from "./routes/chat.routes";

const PORT = process.env.SERVER_PORT;

const app = new App([new UserRouter(), new ChatRouter()], PORT);

app.listen();
