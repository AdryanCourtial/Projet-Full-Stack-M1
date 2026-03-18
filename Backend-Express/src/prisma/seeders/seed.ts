import { seedCategories } from "./categories.seed";

export async function seed() {
    await Promise.all([
        seedCategories()
    ]).then(() => {
        console.log("FIN DU SEEDING DE LA BDD")
    })
}

seed().catch(() => console.log("UNE ERREUR EST SURVENUE"))