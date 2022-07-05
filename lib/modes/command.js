const { exec } = require("child_process");
const messages = require("../utils/console");

module.exports = async (instruction) => {
  console.log(
    messages.startingInstruction.color + messages.startingInstruction.message,
    `command line ${instruction.command}..`
  );
  return new Promise((resolve, reject) => {
    exec(instruction.command, (error, stdout, stderr) => {
      if (error) {
        console.log(`error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
      }

      console.log("\x1b[0m" + `stdout: ${stdout}`);
      console.log("\x1b[32m" + "✅ Command executed");

      resolve(Promise.all(stdout));
    });
  });
};
