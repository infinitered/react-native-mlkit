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

    // Step 2: Publish @infinitered/react-native-mlkit-core first
    const corePackage = releasePlan.releases.find(
      (release) => release.name === "@infinitered/react-native-mlkit-core"
    );

    if (corePackage) {
      console.log('Step 2: Publishing @infinitered/react-native-mlkit-core...');
      await execa("npm", ["publish", "--access", "public"], {
        cwd: corePackage.dir,
        stdio: 'inherit'
      });
      console.log('@infinitered/react-native-mlkit-core published.');
    } else {
      console.log('@infinitered/react-native-mlkit-core not found in the release plan.');
    }

    // Step 3: Publish the other packages
    console.log('Step 3: Publishing other packages...');
    for (const release of releasePlan.releases) {
      if (release.name !== "@infinitered/react-native-mlkit-core") {
        console.log(`Publishing ${release.name}...`);
        await execa("npm", ["publish", "--access", "public"], {
          cwd: release.dir,
          stdio: 'inherit'
        });
        console.log(`${release.name} published.`);
      }
    }
    console.log('All other packages published.');

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
