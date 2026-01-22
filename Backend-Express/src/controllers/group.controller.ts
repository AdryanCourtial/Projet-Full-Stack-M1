import { Request, Response } from "express";
import {
    addGroupMemberService,
    createGroupService,
    getGroupByIdService,
    listGroupsService,
    removeGroupMemberService,
} from "../services/group.service";
import { AddGroupMemberDto, CreateGroupDto } from "../dto/group.dto";

class GroupController {
    static create = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const dto = (req as any).validated_body as CreateGroupDto;

            const group = await createGroupService(userId, dto.name);
            return res.status(201).json({ group });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static list = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const groups = await listGroupsService(userId);
            return res.status(200).json({ groups });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static getById = async (req: Request, res: Response) => {
        try {
            const userId = (req as any).userId as number;
            const groupId = Number(req.params.id);
            if (!Number.isInteger(groupId)) {
                return res.status(400).json({ error: "Invalid id" });
            }

            const group = await getGroupByIdService(userId, groupId);
            if (!group) {
                return res.status(404).json({ error: "Group not found" });
            }

            return res.status(200).json({ group });
        } catch {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    };

    static addMember = async (req: Request, res: Response) => {
        try {
            const ownerId = (req as any).userId as number;
            const groupId = Number(req.params.id);
            const dto = (req as any).validated_body as AddGroupMemberDto;

            await addGroupMemberService(ownerId, groupId, dto.userId);
            return res.status(204).send();
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            return res.status(status).json({ error: err.message });
        }
    };

    static removeMember = async (req: Request, res: Response) => {
        try {
            const ownerId = (req as any).userId as number;
            const groupId = Number(req.params.id);
            const memberUserId = Number(req.params.userId);

            await removeGroupMemberService(ownerId, groupId, memberUserId);
            return res.status(204).send();
        } catch (err: any) {
            const status = err?.statusCode ?? 500;
            return res.status(status).json({ error: err.message });
        }
    };
}

export default GroupController;
