import type { UserListItem } from "../../../interfaces/dto/users";

export const formatAmount = (amount: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(amount);

export const getUserDisplayName = (user?: UserListItem) => {
  if (!user) {
    return "Utilisateur inconnu";
  }

  const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
  return fullName || user.username || user.email || `Utilisateur ${user.id}`;
};
