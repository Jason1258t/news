import { SEED_ADMIN, seedArticles } from "./seed-data.ts";
import { seedEmulators } from "./seed.ts";

await seedEmulators();
console.log(
    `Seeded ${seedArticles.length} articles; admin login: ${SEED_ADMIN.email} (see emulator/seed-data.ts)`,
);
