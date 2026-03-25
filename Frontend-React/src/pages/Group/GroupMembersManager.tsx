import { useEffect, useMemo, useState } from "react";
import GroupsRequest from "../../api/groups";
import UsersRequest from "../../api/users";
import MainInteractiveContainer from "../../components/common/MainInteractiveContainer/MainInteractiveContainer";
import TextInput from "../../components/common/inputText/TextInput";
import type { Group } from "../../interfaces/dto/groups";
import type { UserListItem } from "../../interfaces/dto/users";
import GroupExpenseManager from "./expense/GroupExpenseManager";
import "./GroupMembersManager.css";

interface Props {
  groupId: number | null;
  onGroupUpdated: (updatedGroup: Group) => void;
}

function GroupMembersManager({ groupId, onGroupUpdated }: Props) {
  const [group, setGroup] = useState<Group | null>(null);
  const [users, setUsers] = useState<UserListItem[]>([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoadingGroup, setIsLoadingGroup] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [addingUserId, setAddingUserId] = useState<number | null>(null);
  const [removingUserId, setRemovingUserId] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim().toLowerCase());
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const loadUsers = async () => {
      setIsLoadingUsers(true);

      try {
        const data = await UsersRequest().listAll();
        setUsers(data);
      } catch {
        setFeedback({
          type: "error",
          text: "Impossible de recuperer la liste des utilisateurs.",
        });
      } finally {
        setIsLoadingUsers(false);
      }
    };

    void loadUsers();
  }, []);

  useEffect(() => {
    if (groupId === null) {
      setGroup(null);
      return;
    }

    const loadGroup = async () => {
      setIsLoadingGroup(true);
      setFeedback(null);

      try {
        const currentGroup = await GroupsRequest().getById(groupId);
        setGroup(currentGroup);
        onGroupUpdated(currentGroup);
      } catch {
        setFeedback({
          type: "error",
          text: "Impossible de charger ce groupe.",
        });
      } finally {
        setIsLoadingGroup(false);
      }
    };

    void loadGroup();
  }, [groupId, onGroupUpdated]);

  const memberIds = useMemo(() => {
    if (!group?.members) {
      return new Set<number>();
    }

    return new Set(group.members.map((member) => member.userId));
  }, [group]);

  const currentMembers = useMemo(() => {
    if (!group?.members) {
      return [];
    }

    return group.members.map((member) => {
      const user = users.find((u) => u.id === member.userId);
      return {
        id: member.id,
        userId: member.userId,
        fullName:
          user &&
          `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim().length > 0
            ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
            : user?.username || user?.email || `Utilisateur ${member.userId}`,
      };
    });
  }, [group, users]);

  const searchResults = useMemo(() => {
    if (!debouncedSearch) {
      return [];
    }

    return users.filter((user) => {
      if (memberIds.has(user.id)) {
        return false;
      }

      const fullName = `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
      const searchTarget =
        `${user.email ?? ""} ${user.username ?? ""} ${fullName}`.toLowerCase();
      return searchTarget.includes(debouncedSearch);
    });
  }, [users, memberIds, debouncedSearch]);

  const addMember = async (userId: number) => {
    if (!groupId) {
      return;
    }

    setAddingUserId(userId);
    setFeedback(null);

    try {
      await GroupsRequest().addMember(groupId, { userId });
      const updatedGroup = await GroupsRequest().getById(groupId);
      setGroup(updatedGroup);
      onGroupUpdated(updatedGroup);
      setSearch("");
      setDebouncedSearch("");
      setFeedback({ type: "success", text: "Membre ajoute avec succes." });
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible d'ajouter ce membre au groupe.",
      });
    } finally {
      setAddingUserId(null);
    }
  };

  const removeMember = async (userId: number) => {
    if (!groupId) {
      return;
    }

    setRemovingUserId(userId);
    setFeedback(null);

    try {
      await GroupsRequest().removeMember(groupId, userId);
      const updatedGroup = await GroupsRequest().getById(groupId);
      setGroup(updatedGroup);
      onGroupUpdated(updatedGroup);
      setFeedback({ type: "success", text: "Membre supprime avec succes." });
    } catch {
      setFeedback({
        type: "error",
        text: "Impossible de retirer ce membre du groupe.",
      });
    } finally {
      setRemovingUserId(null);
    }
  };

  if (groupId === null) {
    return (
      <MainInteractiveContainer>
        <h2>Gestion des membres</h2>
        <p className="group-manager-empty">
          Selectionnez un groupe pour le modifier.
        </p>
      </MainInteractiveContainer>
    );
  }

  return (
    <MainInteractiveContainer>
      <div className="group-manager-header">
        <h2>Gestion du groupe {group ? `#${group.id}` : `#${groupId}`}</h2>
        {group && <p>{group.name}</p>}
      </div>

      {isLoadingGroup ? (
        <p className="group-manager-empty">Chargement du groupe...</p>
      ) : (
        <>
          <div className="group-manager-section">
            <h3>Membres actuels</h3>

            {currentMembers.length === 0 ? (
              <p className="group-manager-empty">
                Aucun membre pour le moment.
              </p>
            ) : (
              <div className="group-manager-members-list">
                {currentMembers.map((member) => (
                  <article
                    key={member.userId}
                    className="group-manager-member-card"
                  >
                    <div>
                      <h4>{member.fullName}</h4>
                    </div>

                    <button
                      className="group-manager-remove-btn"
                      type="button"
                      onClick={() => {
                        void removeMember(member.userId);
                      }}
                      disabled={removingUserId === member.userId}
                    >
                      {removingUserId === member.userId
                        ? "Retrait..."
                        : "Retirer"}
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>

          <div className="group-manager-section">
            <h3>Ajouter un membre</h3>

            <TextInput
              id="group-member-search"
              label="Rechercher par nom ou email"
              placeholder="Taper pour rechercher..."
              value={search}
              onChange={setSearch}
              disabled={isLoadingUsers || isLoadingGroup}
            />

            {feedback && (
              <p
                className={`group-feedback ${feedback.type}`}
                role="status"
                aria-live="polite"
              >
                {feedback.text}
              </p>
            )}

            {debouncedSearch ? (
              isLoadingUsers || isLoadingGroup ? (
                <p className="group-manager-empty">Recherche en cours...</p>
              ) : searchResults.length === 0 ? (
                <p className="group-manager-empty">Aucun utilisateur trouve.</p>
              ) : (
                <div className="group-manager-search-results">
                  {searchResults.map((user) => {
                    const fullName =
                      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim();
                    const displayName =
                      fullName ||
                      user.username ||
                      user.email ||
                      `Utilisateur ${user.id}`;

                    return (
                      <article
                        key={user.id}
                        className="group-manager-user-card"
                      >
                        <div>
                          <h4>{displayName}</h4>
                          {user.email && <p>{user.email}</p>}
                        </div>

                        <button
                          className="group-manager-add-btn"
                          type="button"
                          onClick={() => {
                            void addMember(user.id);
                          }}
                          disabled={addingUserId === user.id}
                        >
                          {addingUserId === user.id ? "Ajout..." : "Ajouter"}
                        </button>
                      </article>
                    );
                  })}
                </div>
              )
            ) : (
              <p className="group-manager-empty">
                Tapez pour rechercher des utilisateurs a ajouter.
              </p>
            )}
          </div>

          {group && (
            <div className="group-manager-section">
              <h3>Repartition des depenses (style Tricount)</h3>
              <GroupExpenseManager group={group} users={users} />
            </div>
          )}
        </>
      )}
    </MainInteractiveContainer>
  );
}

export default GroupMembersManager;
