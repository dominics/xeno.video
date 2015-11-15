import { Set } from 'immutable';

export function find(obj, paths, notFound) {
  const path = (typeof paths === 'string') ? paths.split('.') : paths.join('.').split('.');
  let current = obj;

  for (let l = path.length, i = 0; i < l; i++) {
    if (typeof current[path[i]] === 'undefined') {
      return notFound;
    }

    if ((i < l - 1) && typeof current[path[i]] !== 'object') {
      return notFound;
    }

    current = current[path[i]];
  }

  return current;
}

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

export const predicates = {
  keyIn(...args) {
    const keys = Set(args);
    return (v, k) => {
      return keys.has(k);
    };
  },
};
