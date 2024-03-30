import { JwtPayload } from "jsonwebtoken";

interface UserJwtPayload extends JwtPayload {
  userId: string;
}

export default UserJwtPayload;
