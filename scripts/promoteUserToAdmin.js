const { PrismaClient } = require("@prisma/client");
const inquirer = require("inquirer").default;
const process = require("process");
const dotenv = require("dotenv");
const path = require("path");

// Determine the environment, defaulting to 'local' if not set
const environment = process.env.NODE_ENV || "local";

// Construct the path to the appropriate .env file
const envPath = path.resolve(__dirname, `../.env.${environment}`);

// Load environment variables from the .env file
dotenv.config({ path: envPath });

const prisma = new PrismaClient();

async function promoteUserToAdmin(email) {
  const users = await prisma.user.findMany({
    where: { email },
  });

  if (users.length === 0) {
    console.log("No users found with this email.");
    return;
  }

  let selectedUser;

  if (users.length > 1) {
    const choices = users.map((user) => ({
      name: `${user.name} (${user.email})`,
      value: user.id,
    }));
    const answer = await inquirer.prompt([
      {
        type: "list",
        name: "userId",
        message:
          "Multiple users found. Please select one to promote to sysadmin:",
        choices,
      },
    ]);
    selectedUser = users.find((user) => user.id === answer.userId);
  } else {
    selectedUser = users[0];
  }

  const existingAdmin = await prisma.adminUser.findUnique({
    where: { id: selectedUser.id },
  });

  if (existingAdmin) {
    console.log("This user is already an sysadmin.");
    return;
  }

  await prisma.adminUser.create({
    data: {
      user: {
        connect: { id: selectedUser.id },
      },
      updatedAt: new Date(),
    },
  });

  console.log("User promoted to sysadmin successfully.");
}

const email = process.argv[2];
if (!email) {
  console.log("Please provide an email address.");
  process.exit(1);
}

promoteUserToAdmin(email)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
