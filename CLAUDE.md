# Agent notes

## Git flow

The repo uses standard git-flow with a `develop` branch.

- `main` is production: every push to it deploys the site (`.github/workflows/deploy.yml`).
  Never commit to `main` directly and never open feature PRs into it.
- `develop` is the integration branch. Branch new work from an up-to-date `develop`:
  `feat/<name>` for features, `fix/<name>` for bug fixes, `chore/<name>` / `refactor/<name>` for the rest.
- Feature PRs go into `develop`. A release is a PR from `develop` into `main`
  (titled `Release: …`), merged with a merge commit.
- Urgent production fixes: `hotfix/<name>` from `main`, PR into `main`, then merge `main` back into `develop`.
- After a branch is merged, delete it locally and on GitHub.
- Commit or push only when asked, and use Conventional Commits (`feat(scope): …`, `fix: …`, `test: …`).

## Checks

- `npm run check`: format, lint, typecheck, unit tests.
- `npm run test:emulator`: Firestore rules and API tests on the Firebase emulators.
  It cannot start while `npm run dev:emulator` holds the emulator ports.
- Firestore rules live in `firestore.rules` and are deployed separately:
  `firebase deploy --only firestore:rules --project news-78e54`.
