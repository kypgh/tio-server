import fs from "fs";
import path from "path";

import log from "./log";
import DBMigrationModel from "../src/models/DBMigration.model";
import mongooseService from "../src/services/mongoose.service";
import Joi from "joi";

async function getMigrationExists(v) {
  const mm = await DBMigrationModel.findOne({ version: v });
  return !!mm;
}

async function getLastMigration() {
  return DBMigrationModel.findOne().sort({ version: -1 });
}

const migrationFileStructureSchema = Joi.object({
  default: Joi.object({
    up: Joi.func().required(),
    down: Joi.func().required(),
  }),
});

async function main() {
  if (process.argv.length < 3) {
    log.error("Invalid Invocation", "Usage: npm run migrate <version>");
    return;
  }
  let version = Number(process.argv[2]);
  if (isNaN(version)) {
    log.error("Invalid Param", "Version must be a number");
    return;
  }
  await mongooseService.connect();
  let previousMigrationExists =
    version > 1 ? await getMigrationExists(version - 1) : true;
  if (!previousMigrationExists) {
    log.error("Migration Error", "Previous migration does not exist");
    let lastMigration = await getLastMigration();
    log.error(
      "Migration Error",
      "Last migration version:",
      lastMigration?.version ?? 0
    );
    return;
  }
  let migrationExists = await getMigrationExists(version);
  if (migrationExists && process.argv[3] !== "force") {
    log.error("Conflict", "Migration already exists");
    return;
  }
  if (previousMigrationExists) {
    log.info("INFO", "Running migration");
    // find migration file starting with version number
    let filesInDir = fs.readdirSync(__dirname);
    let fileStart = String(version).padStart(3, "0") + "_";
    let migrationFile = filesInDir.find((f) =>
      f.startsWith(String(version).padStart(3, "0") + "_")
    );
    if (!migrationFile) {
      log.error(
        "Migration File Not Found",
        `File starting with '${fileStart}' not found`
      );
      return;
    }
    const importedMigration = await import(path.join(__dirname, migrationFile));
    const { error } = migrationFileStructureSchema.validate(importedMigration);
    if (error) {
      log.error("Invalid Migration File Structure", error);
      return;
    }
    try {
      log.info("RUNNING", migrationFile);
      const stopLoading = log.loading();
      await importedMigration.default.up();
      await DBMigrationModel.create({ version });
      stopLoading();
      log.success("SUCCESS", "Migration complete");
    } catch (err) {
      log.error("ERROR", "Migration failed");
      log.error("ERROR", err);
      await importedMigration.default.down();
    }
  } else {
    log.error(
      "ERROR",
      "Invalid migration version (does not match condition: previousMigrationExists && !migrationExists)"
    );
  }
}

main().then(() => process.exit(0));

// Example migration file:
// const migration001 = {
//   up: async () => {},
//   down: async () => {},
// };

// export default migration001;
