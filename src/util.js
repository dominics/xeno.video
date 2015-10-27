export function mapSchema(obj, schema) {
  const mapped = {};

  for (const name of Object.keys(schema)) {
    const key = (schema[name] === true ? name : schema[name]);
    mapped[name] = (typeof obj[key] !== 'undefined' ? obj[key] : null);
  }

  return mapped;
}
