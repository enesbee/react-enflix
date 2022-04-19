import { useQuery } from "react-query";
import { getMovies, IGetMoviesResult } from "./api";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils/utils";
import { useDirection, useWindowDimensions } from "../utils/useResponsive";
import { useState } from "react";

const Wrapper = styled.div`
  background: black;
  height: 200vh;
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
const Box = styled(motion.div)<{ bgPhoto: string }>`
  background-color: white;
  background-image: url(${(props) => props.bgPhoto});
  background-size: cover;
  background-position: center center;
  height: 0;
  padding-bottom: 56.25%;
  color: red;
  font-size: 60px;
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
                      bgPhoto={makeImagePath(movie.backdrop_path, "w500")}
                    />
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
