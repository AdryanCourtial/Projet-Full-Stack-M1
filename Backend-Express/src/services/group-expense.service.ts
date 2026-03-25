import prisma from "../prisma/client";
import { CreateGroupExpenseDto } from "../dto/group-expense.dto";

type BalanceItem = {
  userId: number;
  name: string;
  paid: number;
  owed: number;
  balance: number;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

const splitEvenlyInCents = (amount: number, count: number) => {
  const totalCents = Math.round(amount * 100);
  const base = Math.floor(totalCents / count);
  const remainder = totalCents % count;

  return Array.from(
    { length: count },
    (_, index) => (base + (index < remainder ? 1 : 0)) / 100,
  );
};

const assertGroupAccessible = async (groupId: number, userId: number) => {
  const group = await prisma.group.findFirst({
    where: {
      id: groupId,
      OR: [{ ownerId: userId }, { members: { some: { userId } } }],
    },
    include: {
      members: {
        select: {
          userId: true,
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              email: true,
            },
          },
        },
      },
      owner: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
        },
      },
    },
  });

  if (!group) {
    const err: any = new Error("Group not found or access denied");
    err.statusCode = 404;
    throw err;
  }

  return group;
};

const buildMemberIds = (
  group: Awaited<ReturnType<typeof assertGroupAccessible>>,
) => {
  const ids = new Set<number>([
    group.ownerId,
    ...group.members.map((m) => m.userId),
  ]);
  return Array.from(ids);
};

const getDisplayName = (user: {
  firstName: string | null;
  lastName: string | null;
  username: string | null;
  email: string;
}) => {
  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.username || user.email;
};

export const createGroupExpenseService = async (
  actorUserId: number,
  groupId: number,
  dto: CreateGroupExpenseDto,
) => {
  const group = await assertGroupAccessible(groupId, actorUserId);
  const memberIds = buildMemberIds(group);

  const paidByUserId = dto.paidByUserId ?? actorUserId;
  if (!memberIds.includes(paidByUserId)) {
    const err: any = new Error("Payer must be a member of the group");
    err.statusCode = 400;
    throw err;
  }

  const participantsRaw = dto.participants?.length
    ? dto.participants
    : memberIds;
  const participants = Array.from(new Set(participantsRaw));

  if (!participants.every((id) => memberIds.includes(id))) {
    const err: any = new Error("All participants must be members of the group");
    err.statusCode = 400;
    throw err;
  }

  if (participants.length === 0) {
    const err: any = new Error("At least one participant is required");
    err.statusCode = 400;
    throw err;
  }

  const shares = splitEvenlyInCents(dto.amount, participants.length);

  const created = await prisma.$transaction(async (tx) => {
    const expense = await tx.groupExpense.create({
      data: {
        groupId,
        paidByUserId,
        amount: round2(dto.amount),
        description: dto.description?.trim() || null,
        date: dto.date ? new Date(dto.date) : new Date(),
      },
    });

    await tx.groupExpenseShare.createMany({
      data: participants.map((userId, index) => ({
        groupExpenseId: expense.id,
        userId,
        amountOwed: shares[index],
      })),
    });

    return tx.groupExpense.findUnique({
      where: { id: expense.id },
      include: {
        paidBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            username: true,
            email: true,
          },
        },
        shares: {
          include: {
            user: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                email: true,
              },
            },
          },
          orderBy: { userId: "asc" },
        },
      },
    });
  });

  return created;
};

export const listGroupExpensesService = async (
  actorUserId: number,
  groupId: number,
) => {
  await assertGroupAccessible(groupId, actorUserId);

  return prisma.groupExpense.findMany({
    where: { groupId },
    include: {
      paidBy: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
        },
      },
      shares: {
        include: {
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              username: true,
              email: true,
            },
          },
        },
        orderBy: { userId: "asc" },
      },
    },
    orderBy: [{ date: "desc" }, { id: "desc" }],
  });
};

export const getGroupBalancesService = async (
  actorUserId: number,
  groupId: number,
) => {
  const group = await assertGroupAccessible(groupId, actorUserId);
  const memberIds = buildMemberIds(group);

  const [paidAgg, owedAgg] = await Promise.all([
    prisma.groupExpense.groupBy({
      by: ["paidByUserId"],
      where: { groupId },
      _sum: { amount: true },
    }),
    prisma.groupExpenseShare.groupBy({
      by: ["userId"],
      where: { groupExpense: { groupId } },
      _sum: { amountOwed: true },
    }),
  ]);

  const paidMap = new Map<number, number>(
    paidAgg.map((item) => [item.paidByUserId, item._sum.amount ?? 0]),
  );
  const owedMap = new Map<number, number>(
    owedAgg.map((item) => [item.userId, item._sum.amountOwed ?? 0]),
  );

  const userById = new Map<
    number,
    {
      firstName: string | null;
      lastName: string | null;
      username: string | null;
      email: string;
    }
  >();
  userById.set(group.owner.id, group.owner);
  for (const member of group.members) {
    userById.set(member.user.id, member.user);
  }

  const balances: BalanceItem[] = memberIds.map((userId) => {
    const paid = round2(paidMap.get(userId) ?? 0);
    const owed = round2(owedMap.get(userId) ?? 0);
    const balance = round2(paid - owed);
    const user = userById.get(userId)!;

    return {
      userId,
      name: getDisplayName(user),
      paid,
      owed,
      balance,
    };
  });

  return {
    group: { id: group.id, name: group.name },
    balances,
  };
};

export const getGroupSettlementsService = async (
  actorUserId: number,
  groupId: number,
) => {
  const result = await getGroupBalancesService(actorUserId, groupId);

  const creditors = result.balances
    .filter((item) => item.balance > 0)
    .map((item) => ({ ...item, remaining: item.balance }))
    .sort((a, b) => b.remaining - a.remaining);

  const debtors = result.balances
    .filter((item) => item.balance < 0)
    .map((item) => ({ ...item, remaining: Math.abs(item.balance) }))
    .sort((a, b) => b.remaining - a.remaining);

  const settlements: Array<{
    fromUserId: number;
    fromName: string;
    toUserId: number;
    toName: string;
    amount: number;
  }> = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const transfer = round2(Math.min(debtor.remaining, creditor.remaining));
    if (transfer <= 0) break;

    settlements.push({
      fromUserId: debtor.userId,
      fromName: debtor.name,
      toUserId: creditor.userId,
      toName: creditor.name,
      amount: transfer,
    });

    debtor.remaining = round2(debtor.remaining - transfer);
    creditor.remaining = round2(creditor.remaining - transfer);

    if (debtor.remaining === 0) i++;
    if (creditor.remaining === 0) j++;
  }

  return {
    group: result.group,
    balances: result.balances,
    settlements,
  };
};
