import prisma from "../prisma/client";

export const createGroupService = async (ownerId: number, name: string) => {
    return prisma.group.create({
        data: {
            name: name.trim(),
            ownerId,
            members: {
                create: { userId: ownerId },
            },
        },
        include: { members: true },
    });
};

export const listGroupsService = async (userId: number) => {
    return prisma.group.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
            ],
        },
        include: { members: true },
        orderBy: { updatedAt: "desc" },
    });
};

export const getGroupByIdService = async (userId: number, groupId: number) => {
    return prisma.group.findFirst({
        where: {
            id: groupId,
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
            ],
        },
        include: { members: true },
    });
};

export const addGroupMemberService = async (
    ownerId: number,
    groupId: number,
    memberUserId: number
) => {
    const group = await prisma.group.findFirst({
        where: { id: groupId, ownerId },
    });
    if (!group) {
        const err: any = new Error("Group not found or not owner");
        err.statusCode = 404;
        throw err;
    }

    const user = await prisma.user.findUnique({
        where: { id: memberUserId },
        select: { id: true },
    });
    if (!user) {
        const err: any = new Error("User not found");
        err.statusCode = 404;
        throw err;
    }

    return prisma.groupMember.create({
        data: {
            groupId,
            userId: memberUserId,
        },
    });
};

export const removeGroupMemberService = async (
    ownerId: number,
    groupId: number,
    memberUserId: number
) => {
    const group = await prisma.group.findFirst({
        where: { id: groupId, ownerId },
    });
    if (!group) {
        const err: any = new Error("Group not found or not owner");
        err.statusCode = 404;
        throw err;
    }

    if (memberUserId === ownerId) {
        const err: any = new Error("Owner cannot be removed from group");
        err.statusCode = 400;
        throw err;
    }

    return prisma.groupMember.deleteMany({
        where: {
            groupId,
            userId: memberUserId,
        },
    });
};
