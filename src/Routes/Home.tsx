import { useQuery } from "react-query";
import {
  getMovies,
  IGetMoviesResult,
  getMovieDetail,
  IGetMovieDetailResult,
} from "./api";
import styled from "styled-components";
import { motion, AnimatePresence, useViewportScroll } from "framer-motion";
import { getGenres, makeImagePath } from "../utils/utils";
import { useDirection, useWindowDimensions } from "../utils/useResponsive";
import { useState } from "react";
import { PathMatch, useMatch, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background: black;
  height: 130vh;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgPhoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgPhoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 68px;
  margin-bottom: 20px;
`;
const Overview = styled.p`
  font-size: 24px;
  width: 50%;
`;

const Slider = styled.div`
  position: relative;
  top: -100px;

  &:hover button {
    opacity: 0.8;
  }
`;
const SliderNav = styled.button`
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto;
  background-color: #888;
  color: white;
  width: 48px;
  height: 48px;
  border: 0;
  border-radius: 18px 0 0 5px;
  transition: opacity 0.5s;
  transition-delay: 0.3s;
  transition-duration: 0.3s;
  opacity: 0;
  cursor: pointer;
`;

const Row = styled(motion.div)<{ direction: string }>`
  display: grid;
  gap: 5px;
  grid-template-columns: repeat(
    ${(props) => (props.direction === "portrait" ? 4 : 6)},
    1fr
  );
  position: absolute;
  width: 100%;
`;
const Box = styled(motion.div)`
  background-color: white;
  font-size: 60px;
  cursor: pointer;

  &:first-child {
    transform-origin: left;
  }

  &:last-child {
    transform-origin: right;
  }
`;
const BoxImage = styled.img`
  display: inherit;
  width: 100%;
`;
const Info = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 10px 20px;
  background-color: ${(props) => props.theme.black.lighter};
  font-size: 12px;
  opacity: 0;
  display: none;

  h4 {
    font-size: 18px;
  }
`;

const GenreList = styled.ul`
  margin: 5px 0;

  li {
    display: inline-block;
    background-color: #000;
    padding: 2px;
    margin-right: 3px;
    font-size: 10px;
    border-radius: 2px;

    &:before {
      content: "#";
    }
  }
`;

const InfoOverview = styled.p`
  margin-top: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  line-height: 14px;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
`;

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  background-color: transparent;
`;

const MovieModalInfo = styled(motion.div)`
  position: absolute;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  margin: 0 auto;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth,
  },
};

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: { delay: 0.3, duration: 0.3, type: "tween" },
  },
};

const infoVariants = {
  hover: {
    display: "block",
    opacity: 1,
    transition: { delay: 0.3, duration: 0.2, type: "tween" },
  },
};

function Home() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const displayRatio = useDirection();
  const resWidth = useWindowDimensions();
  const navigate = useNavigate();
  const moviePathMatch: PathMatch<string> | null = useMatch("/movies/:id");
  const { scrollY } = useViewportScroll();

  const offset = () => {
    return displayRatio === "portrait" ? 4 : 6;
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const { data: movieListData, isLoading: isMovieListLoading } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getMovies);

  const imagePathData = () => {
    return displayRatio === "portrait"
      ? movieListData?.results[0].poster_path
      : movieListData?.results[0].backdrop_path;
  };
  const increaseIndex = () => {
    if (movieListData) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = movieListData?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset() - 1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  const onBoxClicked = (movieId: number) => {
    navigate(`movies/${movieId}`);
  };

  const onOverlayClicked = () => {
    navigate(`/`);
  };
  return (
    <Wrapper>
      {isMovieListLoading ? (
        <Loader>Loading..</Loader>
      ) : (
        <>
          <Banner bgPhoto={makeImagePath(imagePathData() || "")}>
            <Title>{movieListData?.results[0].title}</Title>
            <Overview>{movieListData?.results[0].overview}</Overview>
          </Banner>
          <Slider>
            <AnimatePresence initial={false} onExitComplete={toggleLeaving}>
              <Row
                variants={rowVariants}
                initial={{ x: resWidth - 10 }}
                animate={{ x: 0 }}
                exit={{ x: -resWidth + 10 }}
                transition={{ type: "tween", duration: 1 }}
                key={index}
                direction={displayRatio}
              >
                {movieListData?.results
                  .slice(1)
                  .slice(offset() * index, offset() * index + offset())
                  .map((movie) => (
                    <Box
                      layoutId={movie.id + ""}
                      key={movie.id}
                      initial="normal"
                      whileHover="hover"
                      onClick={() => onBoxClicked(movie.id)}
                      variants={boxVariants}
                      transition={{ type: "tween" }}
                      // bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    >
                      <BoxImage
                        src={makeImagePath(movie.backdrop_path, "w500")}
                        alt={movie.title}
                      />
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                        <GenreList>
                          {getGenres(movie.genre_ids).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))}
                        </GenreList>
                        <div>
                          <span>개봉일 : {movie.release_date}</span>{" "}
                          <span>평점 : {movie.vote_average.toFixed(1)}</span>
                        </div>
                        <InfoOverview>{movie.overview}</InfoOverview>
                      </Info>
                    </Box>
                  ))}
              </Row>
              <SliderNav onClick={increaseIndex}>
                <svg version="1.1" x="0px" y="0px" viewBox="0 0 330 330">
                  <path
                    id="XMLID_222_"
                    d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001
	c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213
	C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606
	C255,161.018,253.42,157.202,250.606,154.389z"
                  />
                </svg>
              </SliderNav>
            </AnimatePresence>
          </Slider>
          <AnimatePresence>
            {moviePathMatch && (
              <>
                <Overlay
                  onClick={onOverlayClicked}
                  exit={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
                <MovieModalInfo
                  layoutId={moviePathMatch.params.id}
                  style={{ top: scrollY.get() + 100 }}
                ></MovieModalInfo>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
