// Error handling function
export const newErr = (message, code) => {
  return JSON.stringify({
    statusCode: `${code}`,
    message: `${message}`,
  });
};

//Available Types
export const currTypes = {
  string: "string",
  number: "number",
  integer: "integer",
  boolean: "boolean",
  array: "array",
  object: "object",
};

// Type checker function
export const newCheck = (root, value) => {
  switch (root.type) {
    case currTypes.number:
    case currTypes.integer:
      if (!isNaN(value)) {
        break;
      }

    case currTypes.string:
      if (isNaN(value)) {
        break;
      }
      throw new Error(newErr("Invalid Request", 400));

    case currTypes.boolean:
      if (typeof value === root.type) {
        break;
      }
      throw new Error(newErr("Invalid Request", 400));

    case currTypes.object:
      if (root.required !== undefined && !(root.required in value)) {
        throw new Error(newErr("Invalid Request", 400));
      }
      if (typeof value === root.type && !Array.isArray(value)) {
        Object.keys(root.properties).forEach((property) => {
          newCheck(root.properties[property], value[property]);
        });
        break;
      }
      throw new Error(newErr("Invalid Request", 400));

    case currTypes.array:
      if (!Array.isArray(value)) {
        newCheck(root.items, value);
        break;
      } else if (Array.isArray(value)) {
        value.forEach((entry) => {
          newCheck(root.items, entry);
        });
        break;
      }
      throw new Error(newErr("Invalid Request", 400));
    default:
      throw new Error(newErr("Invalid Request", 400));
  }
};
