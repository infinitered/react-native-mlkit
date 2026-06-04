// Validates that every changeset references a real workspace package.
//
// This catches the failure mode from #250/#247 -- a changeset pointing at a
// deleted or renamed package -- at PR time, before it reaches `main` where
// `changeset version` would fail. Unlike `changeset status`, it does NOT
// require a changeset to be present (so CI-only/docs PRs don't need an empty
// changeset) and needs no git history.
import getReleasePlan from "@changesets/get-release-plan";

try {
  await getReleasePlan.default(process.cwd());
  console.log("✓ All changesets reference valid packages");
} catch (err) {
  console.error("✗ Invalid changeset detected:");
  console.error(err.message);
  process.exit(1);
}
