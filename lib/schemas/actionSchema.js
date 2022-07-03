module.exports = {
  id: "/Action",
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
