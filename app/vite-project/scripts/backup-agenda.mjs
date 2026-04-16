import fs from 'node:fs/promises';
import path from 'node:path';

const projectRoot = process.cwd();
const backupRoot = path.join(projectRoot, 'backups', 'agenda');

const pad = (n) => String(n).padStart(2, '0');
const stamp = () => {
  const now = new Date();
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;
};

const sourceFiles = [
  'src/components/portaladm/modules/agenda/Agenda.jsx',
  'src/components/portaladm/modules/agenda/AgendaCalendar.css',
  'src/components/portaladm/modules/agenda/agendaSchedule.js'
];

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFileToDir(file, targetDir) {
  const absSource = path.join(projectRoot, file);
  const basename = path.basename(file);
  const absTarget = path.join(targetDir, basename);
  await fs.copyFile(absSource, absTarget);
}

async function pruneOldBackups(limit) {
  let entries = [];
  try {
    entries = await fs.readdir(backupRoot, { withFileTypes: true });
  } catch {
    return;
  }

  const dirs = entries.filter((e) => e.isDirectory()).map((e) => e.name).sort().reverse();
  const toDelete = dirs.slice(limit);
  await Promise.all(toDelete.map((name) => fs.rm(path.join(backupRoot, name), { recursive: true, force: true })));
}

async function main() {
  await ensureDir(backupRoot);
  const dir = path.join(backupRoot, stamp());
  await ensureDir(dir);
  await Promise.all(sourceFiles.map((f) => copyFileToDir(f, dir)));
  await pruneOldBackups(10);
  console.log(`OK: backup da agenda criado em ${dir}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

