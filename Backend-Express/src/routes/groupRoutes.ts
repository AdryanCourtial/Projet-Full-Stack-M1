import GroupController from "../controllers/group.controller";
import { AddGroupMemberDto, CreateGroupDto } from "../dto/group.dto";
import AuthMiddleware from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validation.middleware";
import BaseRouter, { RouteConfig } from "./base.router";

class GroupRoutes extends BaseRouter {
    protected routes(): RouteConfig[] {
        return [
            {
                method: "post",
                path: "/",
                middlewares: [
                    AuthMiddleware.authenticateUser,
                    validationMiddleware(CreateGroupDto, "body"),
                ],
                handler: GroupController.create,
            },
            {
                method: "get",
                path: "/",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: GroupController.list,
            },
            {
                method: "get",
                path: "/:id",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: GroupController.getById,
            },
            {
                method: "post",
                path: "/:id/members",
                middlewares: [
                    AuthMiddleware.authenticateUser,
                    validationMiddleware(AddGroupMemberDto, "body"),
                ],
                handler: GroupController.addMember,
            },
            {
                method: "delete",
                path: "/:id/members/:userId",
                middlewares: [AuthMiddleware.authenticateUser],
                handler: GroupController.removeMember,
            },

        ];
    }
}

export default new GroupRoutes().router;