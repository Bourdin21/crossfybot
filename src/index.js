'use strict';

const { loadAuthorizedUsers, getActiveUsers } = require('./auth');

function main() {
  const data = loadAuthorizedUsers();
  const active = getActiveUsers(data);

  console.log(`crossfybot v${data.version}`);
  console.log(`Usuarios autorizados activos: ${active.length}`);
  active.forEach((u) => console.log(`  - ${u.email}`));
}

main();
