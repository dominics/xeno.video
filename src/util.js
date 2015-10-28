
export function mapSchema(obj, schema) {
  const mapped = {};

  for (const name of Object.keys(schema)) {
    const key = (schema[name] === true ? name : schema[name]);
    mapped[name] = (typeof obj[key] !== 'undefined' ? obj[key] : null);
  }

  return mapped;
}

export function* entries(obj) {
  for (const key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

export function* values(obj) {
  for (const key of Object.keys(obj)) {
    yield obj[key];
  }
}
