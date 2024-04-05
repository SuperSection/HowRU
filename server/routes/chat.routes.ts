import { Router } from "express";

import {
  newGroupChat,
  getMyChats,
  getMyGroups,
  addMembersInGroup,
  removeMemberFromGroup,
  exitGroup,
  sendAttachments,
  getChatDetils,
  renameGroup,
  deleteChat,
  getMessages,
} from "../controllers/chat.controller";

import isUserAuthenticated from "../middlewares/auth.middleware";
import { attachmentsMulter } from "../middlewares/multer.middleware";
import validationMiddleware from "../middlewares/validation.middleware";

import RouteController from "../utils/interfaces/routeController.interface";
import { addMembersValidator, createChatValidator } from "../utils/validators/chat.validation";


class ChatRoutes implements RouteController {
  public path = "/chats";
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    // to protect following routes
    this.router.use(isUserAuthenticated);

    /**
     * Protected Routes
     */
    this.router.post(
      `${this.path}/new`,
      validationMiddleware(createChatValidator),
      newGroupChat,
    );

    this.router.get(`${this.path}`, getMyChats);

    this.router.get(`${this.path}/groups`, getMyGroups);

    // Group specific routes
    this.router.put(`${this.path}/group/add-members`, validationMiddleware(addMembersValidator), addMembersInGroup);

    this.router.put(`${this.path}/group/remove-member`, removeMemberFromGroup);

    this.router.delete(`${this.path}/exit/:groupId`, exitGroup);

    // Send Attachments
    this.router.post(
      `${this.path}/message`,
      attachmentsMulter,
      sendAttachments,
    );

    // Get Messages
    this.router.get(`${this.path}/messages/:chatId`, getMessages);

    // Get Chat Details, Remove, Delete
    this.router.route(`${this.path}/:chatId`).get(getChatDetils).put(renameGroup).delete(deleteChat);
  }
}


export default ChatRoutes;