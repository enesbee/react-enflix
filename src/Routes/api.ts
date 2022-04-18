const API_KEY = process.env.REACT_APP_API_KEY;
const BASE_PATH = "\n" +
  "https://api.themoviedb.org/3";

export interface IGetMoviesResult {
  dates:         {
    maximum: string;
    minimum: string;
  };
  page:          number;
  results:       IMovie[];
  total_pages:   number;
  total_results: number;
}

export interface IMovie {
  adult:             boolean;
  backdrop_path:     string;
  genre_ids:         number[];
  id:                number;
  original_language: OriginalLanguage;
  original_title:    string;
  overview:          string;
  popularity:        number;
  poster_path:       string;
  release_date:      string;
  title:             string;
  video:             boolean;
  vote_average:      number;
  vote_count:        number;
}

export enum OriginalLanguage {
  En = "en",
  Es = "es",
  Fr = "fr",
}

export function getMovies() {
  return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko-KR`).then(response=> response.json())
}