export function makeImagePath(
  id: string,
  format?: "w200" | "w300" | "w400" | "w500" | "original"
) {
  return `https://image.tmdb.org/t/p/${format ? format : "original"}/${id}`;
}
// TS7053: Element implicitly has an 'any' type because expression of type 'number' can't be used to index type '{ 28: string; 12: string; 16: string; 35: string; 80: string; 99: string; 18: string; 10751: string; 14: string; 36: string; 27: string; 10402: string; 9648: string; 10749: string; 878: string; 10770: string; 53: string; 10752: string; 37: string; }'.   No index signature with a parameter of type 'number' was found on type '{ 28: string; 12: string; 16: string; 35: string; 80: string; 99: string; 18: string; 10751: string; 14: string; 36: string; 27: string; 10402: string; 9648: string; 10749: string; 878: string; 10770: string; 53: string; 10752: string; 37: string; }'.

// https://soopdop.github.io/2020/12/01/index-signatures-in-typescript/
interface ArrayLikeType {
  [key: number]: string;
}
export function getGenres(dataArr: number[]) {
  const genreValue: ArrayLikeType = {
    28: "액션",
    12: "모험",
    16: "애니메이션",
    35: "코미디",
    80: "범죄",
    99: "다큐멘터리",
    18: "드라마",
    10751: "가족",
    14: "판타지",
    36: "역사",
    27: "공포",
    10402: "음악",
    9648: "미스터리",
    10749: "로맨스",
    878: "SF",
    10770: "TV 영화",
    53: "스릴러",
    10752: "전쟁",
    37: "서부",
  };
  return dataArr.map((data: number) => {
    return Object.values(genreValue[data]);
  });
}
