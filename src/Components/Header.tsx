import { Link, useRouteMatch } from "react-router-dom";
import styled from "styled-components";
import { motion, useAnimation, useViewportScroll } from "framer-motion";
import { useEffect, useState } from "react";

const Nav = styled(motion.nav)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  width: 100%;
  top: 0;
  font-size: 14px;
  padding: 20px 60px;
  color: white;
`;

const Col = styled.div`
  display: flex;
  align-items: center;
`;

const Logo = styled(motion.svg)`
  margin-right: 50px;
  width: 95px;
  height: 25px;
  fill: ${(props) => props.theme.red};

  path {
    stroke-width: 6px;
    stroke: white;
  }
`;

const Items = styled.ul`
  display: flex;
  align-items: center;
`;

const Item = styled.li`
  margin-right: 20px;
  color: ${(props) => props.theme.white.darker};
  transition: color 0.3s ease-in-out;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;

  &:hover {
    color: ${(props) => props.theme.white.lighter};
  }
`;

const Search = styled.span`
  color: white;
  display: flex;
  align-items: center;
  position: relative;

  svg {
    height: 25px;
  }
`;

const Circle = styled(motion.span)`
  position: absolute;
  width: 5px;
  height: 5px;
  border-radius: 5px;
  bottom: -5px;
  left: 0;
  right: 0;
  margin: 0 auto;
  background-color: ${(props) => props.theme.red};
`;

const Input = styled(motion.input)`
  transform-origin: right center;
  position: absolute;
  right: 0;
  padding: 5px 10px;
  padding-left: 40px;
  z-index: -1;
  color: white;
  font-size: 16px;
  background-color: transparent;
  border: 1px solid ${(props) => props.theme.white.lighter};
`;

const logoVariants = {
  normal: {
    fillOpacity: 1,
  },
  active: {
    fillOpacity: [0, 1, 0],
    transition: {
      repeat: Infinity,
    },
  },
};

const navVariants = {
  top: {
    backgroundColor: "rgba(0, 0, 0, 0)",
  },
  scroll: {
    backgroundColor: "rgba(0, 0, 0, 1)",
  },
};

function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const homeMatch = useRouteMatch("/");
  const tvMatch = useRouteMatch("/tv");
  const inputAnimation = useAnimation();
  const navAnimation = useAnimation();
  const { scrollY } = useViewportScroll();
  const toggleSearch = () => {
    if (searchOpen) {
      inputAnimation.start({
        scaleX: 0,
      });
    } else {
      inputAnimation.start({ scaleX: 1 });
    }
    setSearchOpen((prev) => !prev);
  };
  useEffect(() => {
    scrollY.onChange(() => {
      if (scrollY.get() > 80) {
        navAnimation.start("scroll");
      } else {
        navAnimation.start("top");
      }
    });
  }, [scrollY, navAnimation]);
  return (
    <Nav variants={navVariants} animate={navAnimation} initial={"top"}>
      <Col>
        <Logo
          variants={logoVariants}
          whileHover="active"
          animate="normal"
          xmlns="http://www.w3.org/2000/svg"
          width="1024"
          height="276.742"
          viewBox="0 0 1024 276.742"
        >
          <motion.path d="m 665.34443,-0.0011656 -42.11377,0 0,235.5057356 c 38.27198,1.31687 76.38577,3.24806 114.33999,5.77796 l 0,-41.49257 c -24.00949,-1.60177 -48.08717,-2.95942 -72.22622,-4.0825 z m 334.65312,0.0232 -46.25287,0 -30.48066,70.6714896 -27.41214,-70.6714896 -45.55734,0 48.95999,126.2867756 -53.46049,123.8865 c 14.78346,1.44214 29.53283,2.9809 44.26174,4.60729 l 31.08073,-72.03529 30.78751,79.40656 c 16.03815,2.06191 32.02857,4.21281 47.99852,6.49129 l 0.0614,-0.0269 -54.82427,-141.47937 z M 478.69641,233.44799 l 42.11241,-0.01 0,-95.79929 57.08407,0 0,-41.492576 -57.08407,0 0,-54.25967 75.44475,0 0,-41.8655596 -117.55853,0 z M 321.44483,41.890324 l 44.07081,0 0,194.026126 c 14.01292,-0.52874 28.05448,-0.96474 42.11105,-1.33263 l 0,-192.696426 44.07217,0 0,-41.8682896 -130.25539,0 z M 177.47655,247.97913 c 38.81204,-3.52661 77.80411,-6.43319 116.9721,-8.68937 l 0,-41.49666 c -25.02551,1.44562 -49.98283,3.15785 -74.86514,5.11489 l 0,-62.81881 c 16.32658,-0.16297 37.82397,-0.66075 56.86859,-0.42413 l 0,-41.495986 c -15.21442,-0.0368 -39.66918,0.21275 -56.86859,0.433 l 0,-56.7104 74.86514,0 0,-41.8655596 -116.9721,0 z M 94.865093,152.05711 40.021723,0.0220144 0,0.0220144 0,268.67462 c 14.010194,-1.994 28.0463,-3.90385 42.111046,-5.73562 l 0,-146.09579 48.764967,140.09513 c 15.339207,-1.77907 30.705007,-3.46409 46.100127,-5.04786 l 0,-251.8711956 -42.113774,0 z m 677.448047,91.72838 c 14.06066,1.07582 28.09404,2.22999 42.11378,3.47793 l 0,-247.2411356 -42.11378,0 0,243.7634756" />
        </Logo>
        <Items>
          <Item>
            <Link to="/">
              Home {homeMatch?.isExact && <Circle layoutId="circle" />}
            </Link>
          </Item>
          <Item>
            <Link to="/tv">
              Tv Shows {tvMatch && <Circle layoutId="circle" />}
            </Link>
          </Item>
        </Items>
      </Col>
      <Col>
        <Search>
          <motion.svg
            onClick={toggleSearch}
            animate={{ x: searchOpen ? -210 : 0 }}
            transition={{ type: "linear" }}
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </motion.svg>
          <Input
            animate={inputAnimation}
            initial={{ scaleX: 0 }}
            transition={{ type: "linear" }}
            placeholder="Search for movie or tv show..."
          />
        </Search>
      </Col>
    </Nav>
  );
}

export default Header;
