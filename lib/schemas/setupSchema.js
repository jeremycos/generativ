module.exports = {
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
