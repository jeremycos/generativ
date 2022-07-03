module.exports = {
  id: "/Instruction",
  type: "object",
  properties: {
    file: { type: "string" },
    mode: { type: "string" },
    actions: { type: "array", items: { $ref: "/Action" } },
  },
  required: ["file", "mode", "actions"],
};
