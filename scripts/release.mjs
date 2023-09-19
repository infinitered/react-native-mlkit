const cwd = process.cwd();

async function main() {
  console.log('Starting release process...');
  const { default: { default: getReleasePlan } } = await import('@changesets/get-release-plan');
  const { execa } = await import('execa');

  console.log("GET RELEASE PLAN: ", getReleasePlan);
  console.log("GET RELEASE PLAN: ", typeof getReleasePlan);

  async function customRelease() {
    // Step 1: Build the project
    console.log('Step 1: Building the project...');
    await execa("yarn", ["ci:build"], { stdio: 'inherit' });
    console.log('Build completed.');

    const releasePlan = await getReleasePlan(cwd, "main");

    // ... [rest of the code remains unchanged]

    // Step 4: Log, Push Tags, and other CI steps
    console.log('Step 4: Logging and pushing tags...');

    // Inlined ci:log
    if (process.env.GITHUB_RUN_ID) {
      await execa("echo", ['Successfully published changeset: ' + process.env.GITHUB_RUN_ID, '>', './yarn-release.log'], {
        shell: true,
        stdio: 'inherit'
      });
    }

    // Inlined ci:push-tags
    await execa("git", ["push", "--follow-tags"], { stdio: 'inherit' });

    console.log('Logging and tag pushing completed.');
  }

  await customRelease();
  console.log('Custom release process completed.');
}

main().catch((error) => {
  console.error("Error during custom release:", error);
  process.exit(1);
});
