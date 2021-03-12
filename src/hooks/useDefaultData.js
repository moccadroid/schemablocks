export default function useDefaultData(data, schema) {

  const { properties } = schema.schema;

  Object.entries(properties).map(([key, value]) => {
    if (typeof data[key] === "undefined") {
      data[key] = resolveDefaultValue(value);
    }
  });

  function resolveDefaultValue({ type, controls, properties }) {
    if (type === "string") {
      return controls?.defaultValue ?? "";
    }
    if (type === "boolean") {
      return controls?.defaultValue ?? false;
    }
    if (type === "number") {
      return controls?.defaultValue ?? 0;
    }
    if (type === "object") {
      return Object.entries(properties).map(([key, value]) => {
        return { [key]: resolveDefaultValue(value) }
      }).reduce((acc, cur) => ({...acc, ...cur}));
    }
    if (type === "array") {
      return controls?.defaultValue ?? [];
    }
  }

  return data;
}
