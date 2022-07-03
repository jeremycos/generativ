var path = require("path");
const fs = require("fs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var Validator = require("jsonschema").Validator;
var v = new Validator();

//Custom modules
const { add_after, add_before } = require("./actions");
const { executeCommand } = require("./executecommand");
const messages = require("./utils/console");
const {
  instructionSchema,
  actionSchema,
  variableSchema,
  setupSchema,
} = require("./schemas");

const directory = "."; // We execute globally only in the directory selected

//Schemas
var schema = setupSchema;
v.addSchema(instructionSchema, "/Instruction");
v.addSchema(actionSchema, "/Action");
v.addSchema(variableSchema, "/Variable");

//TODO : Create a github pages to host files with a unique id, so the command "generativ uid" request this specific file
// Example of hosted json script
let urlTest =
  "https://storage.googleapis.com/rocketsetup-2ded0.appspot.com/example-script.json";

let settings = { method: "Get" };

async function getSetupJson(url, settings) {
  return await fetch(url, settings).then((res) => {
    return res.json();
  });
}

/**
 * Look for a file by filePath in root directory, and execute the specific instruction on this file
 *
 * @param {instruction} Object The instruction to execute. Includes file, mode, actions properties
 */
function findFile(instruction, params) {
  const fileName = instruction?.file;

  return new Promise((resolve, reject) => {
    var finder = require("findit")(directory);
    const files = [];

    var totalFilesFound = 0;

    finder.on("file", function (file) {
      if (file.includes(fileName)) {
        totalFilesFound++;
        files.push(file);
      }
    });

    finder.on("error", reject);

    finder.on("end", () => {
      console.log(
        messages.startingInstruction.color,
        messages.startingInstruction.message
      );

      if (totalFilesFound === 0) {
        console.log(messages.noFileFound.color, messages.noFileFound.message);
      }

      if (totalFilesFound === 1) {
        const file = files[0];

        console.log(
          messages.fileFound.color + messages.fileFound.message,
          file
        );

        //if the file is found, we read the content of it and print it to the console
        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          var newData = instruction?.actions?.reduce((acc, item) => {
            //We use reduce to save/accumulate the modifications on the new code

            var isExist = data.indexOf(item.reference) >= 0;

            //Check & get variables
            if (item?.variables?.length > 0) {
              item.variables.map((variable) => {
                var check = variable?.name in params;

                if (check) {
                  item.code = item.code.replace(
                    `%${variable.name}`,
                    params[variable.name]
                  );

                  console.log(
                    messages.replacedCode.color + messages.replacedCode.message,
                    `%${variable?.name}`,
                    params[variable.name]
                  );
                }
              });
            }

            //Execute actions on code
            if (isExist) {
              console.log(
                messages.expressionFound.color +
                  messages.expressionFound.message,
                item.reference
              );

              switch (item.type) {
                case "add_after":
                  return add_after(
                    item.reference,
                    item.code,
                    item.isUnique,
                    acc
                  );
                case "add_before":
                  return add_before(
                    item.reference,
                    item.code,
                    item.isUnique,
                    acc
                  );
                default:
                  return acc;
              }
            } else {
              console.log(
                messages.expressionNotFound.color +
                  messages.expressionNotFound.message,
                item.reference
              );
            }
          }, data);

          if (newData !== data && newData !== "") {
            fs.writeFile(file, newData, { flag: "w+" }, () =>
              console.log(
                messages.fileModified.color + messages.fileModified.message,
                file
              )
            );
          } else {
            console.log(
              messages.fileNotModified.color + messages.fileNotModified.message,
              file
            );
          }
        });
      }

      //if many files with the same filepath, we don't execute the script. Need to be more precise
      if (totalFilesFound > 1) {
        console.log(
          messages.manySameFiles.color,
          messages.manySameFiles.message,
          files
        );
      }

      return resolve(Promise.all(files));
    });
  });
}

async function main() {
  var argv = require("minimist")(process.argv.slice(2));

  //We check if the url provided in params is valid
  if (argv?.url?.length > 0 && argv?.url?.includes(".json")) {
    const json = await getSetupJson(argv.url, settings);

    //We check if json given has a valid format
    const isValidFormat = v.validate(json, schema, {
      nestedErrors: true,
    }).valid;

    var params = {};

    //We transform the "--params variable1=test+variable2=test" into a object of params.
    if (argv?.params?.length > 0) {
      argv?.params
        .split("+")
        .forEach((part) => (params[part.split("=")[0]] = part.split("=")[1]));
    }

    if (isValidFormat) {
      console.log(messages.JSONisValid.color + messages.JSONisValid.message);

      //We execute all the instructions of the script
      for (instruction of json.instructions) {
        await findFile(instruction, params);
      }
    } else {
      console.log(messages.noValidJSON.color, messages.noValidJSON.message);
    }
  } else {
    console.log(messages.noValidUrl.color, messages.noValidUrl.message);
  }
}

module.exports = { main };
