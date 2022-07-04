const { isValidURL } = require("./helpers");
const messages = require("./console");

const fetch = (...args) =>
  import("node-fetch").then(({ default: fetch }) => fetch(...args));

async function getJSON(_string) {
  let url = isValidURL(_string)
    ? _string
    : `https://jeremycos.github.io/generativ/${_string}.json`;

  console.log(messages.gettingURL.color + messages.gettingURL.message, url);

  return await fetch(url, { method: "Get" }).then((res) => res.json());
}

module.exports = { getJSON };
