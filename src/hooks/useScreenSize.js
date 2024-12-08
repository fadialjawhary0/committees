import { useState, useEffect } from 'react';
import { SCREEN_SIZES } from '../constants';

const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    isSmall: false,
    isMedium: false,
    isLarge: false,
    isXLarge: false,
  });

  const handleResize = () => {
    setScreenSize({
      // For small mobile devices, screens that are 768px and below
      isSmall: window.matchMedia(`(max-width: ${SCREEN_SIZES.SMALL}px)`).matches,

      // For medium devices, screens between 769px and 900px
      isMedium: window.matchMedia(`(min-width: ${SCREEN_SIZES.SMALL + 1}px) and (max-width: ${SCREEN_SIZES.MEDIUM}px)`).matches,

      // For large devices, screens between 901px and 1260px
      isLarge: window.matchMedia(`(min-width: ${SCREEN_SIZES.MEDIUM + 1}px) and (max-width: ${SCREEN_SIZES.LARGE}px)`).matches,

      // For extra-large devices, screens between 1261px and 1536px
      isXLarge: window.matchMedia(`(min-width: ${SCREEN_SIZES.LARGE + 1}px) and (max-width: ${SCREEN_SIZES.XLARGE}px)`).matches,

      // For very large desktop screens, screens larger than 1536px
      isXXLarge: window.matchMedia(`(min-width: ${SCREEN_SIZES.XLARGE + 1}px)`).matches,
    });
  };

  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return screenSize;
};

export default useScreenSize;

// import { useState, useEffect } from 'react';
// import { SCREEN_SIZES } from '../constants';
// import debounce from 'lodash.debounce';

// const useScreenSize = () => {
//   const [screenSize, setScreenSize] = useState({
//     isSmall: false,
//     isMedium: false,
//     isLarge: false,
//     isXLarge: false,
//   });

//   const handleResize = debounce(() => {
//     setScreenSize({
//       isSmall: window.matchMedia(`(max-width: ${SCREEN_SIZES.SMALL}px)`).matches,
//       isMedium: window.matchMedia(`(min-width: ${SCREEN_SIZES.SMALL + 1}px) and (max-width: ${SCREEN_SIZES.MEDIUM}px)`).matches,
//       isLarge: window.matchMedia(`(min-width: ${SCREEN_SIZES.MEDIUM + 1}px) and (max-width: ${SCREEN_SIZES.LARGE}px)`).matches,
//       isXLarge: window.matchMedia(`(min-width: ${SCREEN_SIZES.LARGE + 1}px) and (max-width: ${SCREEN_SIZES.XLARGE}px)`).matches,
//       isXXLarge: window.matchMedia(`(min-width: ${SCREEN_SIZES.XLARGE + 1}px)`).matches,
//     });
//   }, 100);

//   useEffect(() => {
//     handleResize();
//     window.addEventListener('resize', handleResize);

//     return () => {
//       window.removeEventListener('resize', handleResize);
//       handleResize.cancel();
//     };
//   }, []);

//   return screenSize;
// };

// export default useScreenSize;
