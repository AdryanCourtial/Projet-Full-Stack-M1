import { seedCategories } from "./categories.seed";

export default function main() {
    Promise.all([
        seedCategories()
    ]).then(() => {
        console.log("FIN DU SEEDING DE LA BDD")
    })
}