// ./bin/encrypt-secrets.js
const secrets = require("gitops-secrets");

async function main() {
  const payload = await secrets.providers.doppler.fetch();
  secrets.build(payload);
  console.log("----  Loaded secrets ----");
}

main();
