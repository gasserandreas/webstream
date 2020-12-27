// import React, {
//   useRef,
//   useEffect,
//   useState,
//   useCallback,
//   FunctionComponent,
// } from 'react';

// import {
//   Switch,
//   Route,
//   useRouteMatch,
//   RouteComponentProps,
// } from 'react-router-dom';

// import { makeStyles, createStyles } from '@material-ui/core/styles';

// import IFrame from '../../ui/iFrame';

// // type definitions
// type SizeDefinition = Optional<{
//   height: number;
//   width: number;
// }>;

// type Indices = {
//   odd: number;
//   even: number;
// };

// enum VisibleFrame {
//   EVEN = 'even',
//   ODD = 'odd',
// }

// // interval definitions
// const INTERVAL_TIME = 30 * 1000;
// const INTERVAL_TIME_DELAY = 5000;

// const useStyles = makeStyles(() =>
//   createStyles({
//     wrapper: {
//       width: '100%',
//       height: '100%',
//       position: 'relative',
//     },
//     frame: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//     },
//   })
// );

// function getSizeForDiv(div: HTMLDivElement): SizeDefinition {
//   if (!div) {
//     return null;
//   }
//   const { clientHeight, clientWidth } = div;

//   return {
//     height: clientHeight,
//     width: clientWidth,
//   };
// }

// const LINKS = [
//   'https://buochs.roundshot.com',
//   'https://kaeserstatt.roundshot.com',
//   'https://grindelwaldbus.roundshot.com',
//   'https://gemmi.roundshot.com',
// ];

// const IndexPage: FunctionComponent = () => {
//   const classes = useStyles();

//   const wrapperRef = useRef<HTMLDivElement>(null);
//   const indexIntervalRef = useRef<ReturnType<typeof setInterval>>();
//   const toggleIntervalRef = useRef<ReturnType<typeof setInterval>>();

//   const [indices, setIndices] = useState<Indices>({ even: 0, odd: 1 });

//   const [sizes, setSizes] = useState<SizeDefinition | null>(null);
//   const visibleFrameRef = useRef(VisibleFrame.EVEN);

//   function getNextIndex(prevIndex: number): number {
//     let nextIndex = prevIndex + 1;

//     if (nextIndex === LINKS.length) {
//       nextIndex = 0;
//     }

//     return nextIndex;
//   }

//   const handleIndexInterval = useCallback((prevIndices: Indices) => {
//     const newIndices = { ...prevIndices };

//     if (visibleFrameRef.current === VisibleFrame.EVEN) {
//       newIndices.odd = getNextIndex(newIndices.even);
//     } else {
//       newIndices.even = getNextIndex(newIndices.odd);
//     }

//     return newIndices;
//   }, []);

//   // get size
//   useEffect(() => {
//     const div = wrapperRef.current;

//     if (div) {
//       setSizes(getSizeForDiv(div));
//     }
//   }, []);

//   useEffect(() => {
//     // handle index change
//     toggleIntervalRef.current = setInterval(() => {
//       visibleFrameRef.current =
//         visibleFrameRef.current === VisibleFrame.EVEN
//           ? VisibleFrame.ODD
//           : VisibleFrame.EVEN;
//     }, INTERVAL_TIME);

//     setTimeout(() => {
//       console.log('create event handler...'); // eslint-disable-line no-console
//       indexIntervalRef.current = setInterval(() => {
//         setIndices((prevIndices) => handleIndexInterval(prevIndices));
//       }, INTERVAL_TIME);

//       // change first index
//       setIndices((prevIndices) => handleIndexInterval(prevIndices));
//     }, INTERVAL_TIME - INTERVAL_TIME_DELAY);

//     return () => {
//       if (indexIntervalRef.current) {
//         console.log('clear indexIntervalRef interval'); // eslint-disable-line no-console
//         clearInterval(indexIntervalRef.current);
//       }

//       if (toggleIntervalRef.current) {
//         console.log('clear toggleIntervalRef interval'); // eslint-disable-line no-console
//         clearInterval(toggleIntervalRef.current);
//       }
//     };
//   }, [handleIndexInterval]);

//   const { even, odd } = indices;
//   const visibleFrame = visibleFrameRef.current;

//   return (
//     <div className={classes.wrapper} ref={wrapperRef}>
//       <div
//         className={classes.frame}
//         style={{ opacity: visibleFrame === VisibleFrame.EVEN ? 1 : 0 }}
//       >
//         <IFrame
//           link={LINKS[even]}
//           width={sizes?.width}
//           height={sizes?.height}
//         />
//       </div>
//       <div
//         className={classes.frame}
//         style={{ opacity: visibleFrame === VisibleFrame.ODD ? 1 : 0 }}
//       >
//         <IFrame link={LINKS[odd]} width={sizes?.width} height={sizes?.height} />
//       </div>
//     </div>
//   );
// };

// const IndexHandler: FunctionComponent<RouteComponentProps> = () => {
//   const { path } = useRouteMatch();
//   return (
//     <Switch>
//       <Route exact path={path} component={IndexPage} />
//     </Switch>
//   );
// };

// export default IndexHandler;
