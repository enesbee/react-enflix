import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "./api";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { getGenres, makeImagePath } from "../utils/utils";
import { useDirection, useWindowDimensions } from "../utils/useResponsive";
import { useState } from "react";

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
  &:first-child {
    transform-origin: 50% 0;
  }
  &:last-child {
    transform-origin: 50% 100%;
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
    margin-bottom: 5px;
    //color: #222;
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
    opacity: 1,
    transition: { delay: 0.3, duration: 0.2, type: "tween" },
  },
};
function Home() {
  const [index, setIndex] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const displayRatio = useDirection();
  const resWidth = useWindowDimensions();

  const offset = () => {
    return displayRatio === "portrait" ? 4 : 6;
  };
  const toggleLeaving = () => setLeaving((prev) => !prev);
  const { data, isLoading } = useQuery<IGetMoviesResult>(
    ["movies, nowPlaying"],
    getMovies
  );
  const imagePathData = () => {
    return displayRatio === "portrait"
      ? data?.results[0].poster_path
      : data?.results[0].backdrop_path;
  };
  const increaseIndex = () => {
    if (data) {
      if (leaving) return;
      toggleLeaving();
      const totalMovies = data?.results.length - 1;
      const maxIndex = Math.floor(totalMovies / offset() - 1);
      setIndex((prev) => (prev === maxIndex ? 0 : prev + 1));
    }
  };
  return (
    <Wrapper>
      {isLoading ? (
        <Loader>Loading..</Loader>
      ) : (
        <>
          <Banner
            onClick={increaseIndex}
            bgPhoto={makeImagePath(imagePathData() || "")}
          >
            <Title>{data?.results[0].title}</Title>
            <Overview>{data?.results[0].overview}</Overview>
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
                {data?.results
                  .slice(1)
                  .slice(offset() * index, offset() * index + offset())
                  .map((movie) => (
                    <Box
                      key={movie.id}
                      initial="normal"
                      whileHover="hover"
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
                          {getGenres(movie.genre_ids).map((item) => (
                            <li>{item}</li>
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
            </AnimatePresence>
          </Slider>
        </>
      )}
    </Wrapper>
  );
}

export default Home;
