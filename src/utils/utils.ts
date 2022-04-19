export function makeImagePath(
  id: string,
  format?: "w200" | "w300" | "w400" | "w500" | "original"
) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
