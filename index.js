#! /usr/bin/env node

var path = require("path");
const fs = require("fs");
const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));
var Validator = require("jsonschema").Validator;
var v = new Validator();
const { executeCommand } = require("./executecommand");

const directory = "../..";

//Schemas
var variableSchema = {
  id: "/Variable",
  type: "object",
  properties: {
    name: { type: "string" },
    defaultValue: { type: "string" },
  },
  required: ["name", "defaultValue"],
};

var lineSchema = {
  id: "/Line",
  type: "object",
  properties: {
    reference: { type: "string", minLength: 6 },
    code: { type: "string" },
    isUnique: { type: "bool" },
    type: { type: "string" },
    variables: { type: "array", items: { $ref: "/Variable" } },
  },
  required: ["reference", "code", "isUnique", "type"],
};

var instructionSchema = {
  id: "/Instruction",
  type: "object",
  properties: {
    file: { type: "string" },
    mode: { type: "string" },
    actions: { type: "array", items: { $ref: "/Line" } },
  },
  required: ["file", "mode", "actions"],
};

var schema = {
  id: "/Setup",
  type: "object",
  properties: {
    uid: { type: "string" },
    name: { type: "string" },
    description: { type: "string" },
    instructions: { type: "array", items: { $ref: "/Instruction" } },
  },
  required: ["uid", "name", "description", "instructions"],
};

v.addSchema(instructionSchema, "/Instruction");
v.addSchema(lineSchema, "/Line");
v.addSchema(variableSchema, "/Variable");

let urlTest =
  "https://storage.googleapis.com/rocketsetup-2ded0.appspot.com/insertRocket.json";
let settings = { method: "Get" };

async function getSetupJson(url, settings) {
  return await fetch(url, settings).then((res) => {
    return res.json();
  });
}

const messages = {
  noFileFound: "❌ No file found in the directory",
  manySameFiles:
    "❌ There are many files with the same name. Here is the list : ",
};

/*
finder.on('directory', function (dir, stat, stop) {
  var base = path.basename(dir);
  if (base === '.git' || base === 'node_modules') stop();
  if (base === 'src') console.log(dir + '/');
});
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
      console.log("\x1b[0m", `\nStarting instruction...`);

      if (totalFilesFound === 0) {
        console.log("\x1b[31m", messages.noFileFound);
      }

      if (totalFilesFound === 1) {
        const file = files[0];

        var newData = "";

        console.log("\x1b[32m", "✅ File found: ", file);

        //if the file is found, we read the content of it and print it to the console
        fs.readFile(file, "utf8", (err, data) => {
          if (err) {
            console.error(err);
            return;
          }

          instruction?.actions?.forEach((item) => {
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
                    "\x1b[32m",
                    "✅ Replaced  %" +
                      variable?.name +
                      " with " +
                      params[variable.name]
                  );
                }
              });
            }

            if (item.type === "add_before") {
              if (isExist) {
                console.log(
                  "\x1b[32m",
                  '✅ Insert before code: Expression "' +
                    item.reference +
                    '" found'
                );
                if (item.isUnique) {
                  newData = data.replace(
                    item.reference,
                    item.code + item.reference
                  ); //Insert before
                } else {
                  newData = data.replaceAll(
                    item.reference,
                    item.code + item.reference
                  );
                }
              } else {
                console.log(
                  "\x1b[31m",
                  '❌ Insert before code: Expression "' +
                    item.reference +
                    '" not found'
                );
              }
            }
            if (item.type === "add_after") {
              if (isExist) {
                console.log(
                  "\x1b[32m",
                  '✅ Insert after code: Expression "' +
                    item.reference +
                    '" found'
                );
                if (item.isUnique) {
                  newData = newData.replace(
                    item.reference,
                    item.reference + item.code
                  ); //Insert before
                } else {
                  newData = newData.replaceAll(
                    item.reference,
                    item.reference + item.code
                  );
                }
              } else {
                console.log(
                  "\x1b[31m",
                  '❌ Insert after code: Expression "' +
                    item.reference +
                    '" not found'
                );
              }
            }
          });

          if (newData !== data && newData !== "") {
            fs.writeFile(file, newData, { flag: "w+" }, () =>
              console.log("\x1b[32m", "✅ File modified: ", file)
            );
          } else {
            console.log("\x1b[31m", "❌ File not modified");
          }
        });
      }

      if (totalFilesFound > 1) {
        console.log("\x1b[31m", messages.manySameFiles, files);
      }

      return resolve(Promise.all(files));

      //hint, if you're working with recursive stuff, you may have nested Arrays, so you should flatten the result
      //resolve( Promise.all(files).then(values => values.reduce((a,b) => a.concat(b), [])) )
    });
  });
}

(async function main() {
  var argv = require("minimist")(process.argv.slice(2));

  if (argv?.url?.length > 0 && argv?.url?.includes(".json")) {
    const json = await getSetupJson(argv.url, settings);

    const isValidFormat = v.validate(json, schema, {
      nestedErrors: true,
    }).valid;

    var params = {};

    console.log(process.argv);
    if (argv?.params?.length > 0) {
      argv?.params
        .split("+")
        .forEach((part) => (params[part.split("=")[0]] = part.split("=")[1]));
    }

    if (isValidFormat) {
      console.log("\x1b[32m", "\nJSON provided is correct");

      for (instruction of json.instructions) {
        await findFile(instruction, params);
      }
    } else {
      console.log(
        "\x1b[31m",
        "\nNo valid json format. Please read the doc to provide a correct json file."
      );
    }
  } else {
    console.log(
      "\x1b[31m",
      "\nNo valid url. Use --url yoururl.json as arguments"
    );
  }
})();

//TODO : unique id from rocketsetup cloud repertory with public access or with private access

//TODO : rocket setup for add

//TODO : batch file => Only change instruction when it's needed

//TODO : add specific variables --name Jeremy --simpleurl Test

//TODO : install package and wait for installation

//IDEE Rocketsetup cloud permet de stocker tous ses composants facilement et rapidement. Chaque composant est repertorié à un projet avec une variation particulière
//Rocket push permet d'ajouter un variant facilement à son repertoire en fonction d'un modèle défini.
//Acquisition client => Stackoverflow, avec tous les repertoires public. Création d'un batch simple.
//Rocket cloud est 100% gratuit. On met à jour vos bibliothèques facilement et rapidement, sans prise de tête.
