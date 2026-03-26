import { useCallback, useEffect, useState, type FormEvent } from "react";
import GroupsRequest from "../../api/groups";
import MainInteractiveContainer from "../../components/common/MainInteractiveContainer/MainInteractiveContainer";
import TextInput from "../../components/common/inputText/TextInput";
import type { Group as GroupItem } from "../../interfaces/dto/groups";
import GroupMembersManager from "./GroupMembersManager";
import "./Group.css";
import Feedback, { type Feeback } from "../../components/common/Feedback/Feedback";

function Group() {
  const [groups, setGroups] = useState<GroupItem[]>([]);
  const [groupName, setGroupName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [feedbackGroup, setFeedbackGroup] = useState<Feeback>();
  
  const fetchGroups = async () => {
    setIsLoading(true);

    try {
      const data = await GroupsRequest().list();
      setGroups(data);
    } catch {
      setFeedbackGroup({
        type: "error",
        text: "Impossible de charger vos groupes pour le moment.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchGroups();
  }, []);

  const createGroup = async () => {
    const trimmedName = groupName.trim();

    if (!trimmedName) {
      setFeedbackGroup({ type: "error", text: "Le nom du groupe est obligatoire." });
      return;
    }

    setIsSubmitting(true);

    try {
      const createdGroup = await GroupsRequest().create({ name: trimmedName });

      setGroups((previousGroups) => [createdGroup, ...previousGroups]);
      setGroupName("");
      setFeedbackGroup({ type: "success", text: "Groupe cree avec succes." });
    } catch {
      setFeedbackGroup({
        type: "error",
        text: "La creation du groupe a echoue. Reessayez dans un instant.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createGroup();
  };

  const updateGroupInList = useCallback((updatedGroup: GroupItem) => {
    setGroups((previousGroups) => {
      const alreadyPresent = previousGroups.some(
        (group) => group.id === updatedGroup.id,
      );

      if (!alreadyPresent) {
        return [updatedGroup, ...previousGroups];
      }

      return previousGroups.map((group) =>
        group.id === updatedGroup.id ? updatedGroup : group,
      );
    });
  }, []);

  return (
    <main className="group-page">
      <MainInteractiveContainer>
        <div className="group-header">
          <h1>Groupes</h1>
          <p>Creez et retrouvez vos groupes de depenses partagees.</p>
        </div>
      </MainInteractiveContainer>

      <MainInteractiveContainer>
        <form className="group-create-form" onSubmit={handleSubmit}>
          <TextInput
            id="groupName"
            label="Nom du groupe"
            placeholder="Exemple: Coloc Bastille"
            value={groupName}
            onChange={setGroupName}
            disabled={isSubmitting}
          />

          <button
            className="group-create-btn"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creation..." : "Creer le groupe"}
          </button>
        </form>

        <Feedback feedBack={feedbackGroup} />

      </MainInteractiveContainer>

      <MainInteractiveContainer>
        <h2>Mes groupes</h2>

        {isLoading ? (
          <p className="group-empty">Chargement des groupes...</p>
        ) : groups.length === 0 ? (
          <p className="group-empty">
            Aucun groupe pour le moment. Creez-en un pour commencer.
          </p>
        ) : (
          <div className="group-list">
            {groups.map((group) => (
              <article key={group.id} className="group-card">
                <div>
                  <h3>{group.name}</h3>
                  <p>#{group.id}</p>
                </div>

                <div className="group-card-actions">
                  <p>
                    {group.members?.length ?? 0} membre
                    {(group.members?.length ?? 0) > 1 ? "s" : ""}
                  </p>

                  <button
                    type="button"
                    className={
                      selectedGroupId === group.id
                        ? "group-select-btn active"
                        : "group-select-btn"
                    }
                    onClick={() =>
                      setSelectedGroupId((previousValue) =>
                        previousValue === group.id ? null : group.id,
                      )
                    }
                  >
                    Gerer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </MainInteractiveContainer>

      {selectedGroupId !== null && (
        <GroupMembersManager
          groupId={selectedGroupId}
          onGroupUpdated={updateGroupInList}
        />
      )}
    </main>
  );
}

export default Group;
