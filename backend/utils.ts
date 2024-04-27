/**
 * Splits a list into multiple chunks based on the chunk size.
 * @param data to split into chunks.
 * @param size of each chunk.
 * @returns a list full of chunks from the original data.
 */
export function chunkify<T>(data: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < data.length; i += size) {
    result.push(data.slice(i, i + size));
  }
  return result;
}
