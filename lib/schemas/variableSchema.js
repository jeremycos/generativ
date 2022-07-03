module.exports = {
  id: "/Variable",
  type: "object",
  properties: {
    name: { type: "string" },
    defaultValue: { type: "string" },
  },
  required: ["name", "defaultValue"],
};
