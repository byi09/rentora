// ------------------------------------------------------
// |   Utility functions for converting data formats.   |
// ------------------------------------------------------

/**
 * Converts a list of objects to a map by a specified key.
 * @param list - Array of objects to convert
 * @param key - Key to use for mapping
 * @return Record with key-value pairs
 */
export function listToMap<T extends object>(
  list: T[],
  key: keyof T
): Record<string, T> {
  return list.reduce((map: Record<string, T>, item) => {
    const keyValue = String(item[key]);
    if (keyValue) map[keyValue] = item;
    return map;
  }, {});
}
