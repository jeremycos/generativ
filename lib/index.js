var Validator = require("jsonschema").Validator;
var v = new Validator();

const messages = require("./utils/console");
const {
  instructionSchema,
  actionSchema,
  variableSchema,
  setupSchema,
} = require("./schemas");
const { getJSON } = require("./utils/fetch");
const { update_file, command } = require("./modes");

//Schemas
var schema = setupSchema;
v.addSchema(instructionSchema, "/Instruction");
v.addSchema(actionSchema, "/Action");
v.addSchema(variableSchema, "/Variable");

async function main() {
  var argv = require("minimist")(process.argv.slice(2));

  //GET JSON from url or unique public id from the database
  if (argv?.get?.length > 0 /*&& argv?.url?.includes(".json")*/) {
    //We check if this is an url, otherwise it should be an unique identifier from cloud

    try {
      const json = await getJSON(argv.get);

      //We check if json given has a valid format
      const isValidFormat = true; /*v.validate(json, schema, {
        nestedErrors: true,
      }).valid;*/

      var params = {};

      //We transform the "--params variable1=test+variable2=test" into a object of params.
      if (argv?.params?.length > 0) {
        argv?.params
          .split("+")
          .forEach((part) => (params[part.split("=")[0]] = part.split("=")[1]));
      }

      if (isValidFormat) {
        console.log(messages.JSONisValid.color + messages.JSONisValid.message);
        let i = 0;

        //We execute all the instructions of the script
        for (instruction of json.instructions) {
          i++;
          //We check the mode

          switch (instruction.mode) {
            case "update_file":
              await update_file(instruction, params);
              break;

            case "command":
              await command(instruction, params);
              break;

            default:
              console.log(
                messages.noCorrectMode.color + messages.noCorrectMode.message,
                i
              );
          }
        }
      } else {
        console.log(messages.noValidJSON.color, messages.noValidJSON.message);
      }
    } catch (e) {
      console.error(e);
    }
  } else {
    console.log(messages.noValidUrl.color, messages.noValidUrl.message);
  }
}

module.exports = { main };
