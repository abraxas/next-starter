const { PrismaClient } = require("@prisma/client");
const inquirer = require("inquirer").default;
const dotenv = require("dotenv");
const process = require("process");
const path = require("path");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");

const environment = process.env.NODE_ENV || "local";
const envPath = path.resolve(__dirname, `../.env.${environment}`);
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

async function deleteArchivedDataForModel(model, skipPrompt) {
  const modelInstance = prisma[model];

  if (!modelInstance) {
    console.error(`Model ${model} not found in PrismaClient.`);
    return;
  }

  try {
    const archivedCount = await modelInstance.count({
      where: { archived: true },
    });

    if (archivedCount > 0) {
      console.log(
        `${archivedCount} archived rows found in the ${model} table.`,
      );

      let confirmDeletion = skipPrompt;
      if (!skipPrompt) {
        const answers = await inquirer.prompt([
          {
            type: "confirm",
            name: "confirmDeletion",
            message: `Are you sure you want to delete ${archivedCount} archived rows from ${model}?`,
          },
        ]);
        confirmDeletion = answers.confirmDeletion;
      }

      if (confirmDeletion) {
        const deletionResult = await modelInstance.deleteMany({
          where: { archived: true },
        });
        console.log(
          `${deletionResult.count} rows deleted from ${model} table.`,
        );
      } else {
        console.log("Deletion cancelled.");
      }
    } else {
      console.log(`No archived rows found in the ${model} table.`);
    }
  } catch (error) {
    console.log(
      `Skipping ${model}: does not have an "archived" flag or other error occurred.`,
    );
  }
}

async function deleteArchivedData(skipPrompt) {
  const modelsToDeleteArchivedDataFrom = [
    "Organization",
    "Organization",
    "User",
  ]; // Adjust the model names as needed

  for (const model of modelsToDeleteArchivedDataFrom) {
    await deleteArchivedDataForModel(model, skipPrompt);
  }
}

// Parse command line arguments for the -y flag
const argv = yargs(hideBin(process.argv)).argv;
const skipPrompt = argv.y;

deleteArchivedData(skipPrompt)
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
