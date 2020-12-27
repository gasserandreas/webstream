import React, { useRef, useEffect, useState, FunctionComponent } from 'react';

import {
  Switch,
  Route,
  useRouteMatch,
  RouteComponentProps,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import { streamsActions } from '../../entities/streams/index';

// import IFrame from '../../ui/iFrame';

// type definitions
type SizeDefinition = Optional<{
  height: number;
  width: number;
}>;

const useStyles = makeStyles(() =>
  createStyles({
    wrapper: {
      width: '100%',
      height: '100%',
      position: 'relative',
    },
    frame: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
    },
  })
);

function getSizeForDiv(div: HTMLDivElement): SizeDefinition {
  if (!div) {
    return null;
  }
  const { clientHeight, clientWidth } = div;

  return {
    height: clientHeight,
    width: clientWidth,
  };
}

const IndexPage: FunctionComponent = () => {
  const classes = useStyles();

  const dispatch = useDispatch();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<SizeDefinition | null>(null);

  console.log({ sizes }); // eslint-disable-line

  /**
   * web frame start and end actions
   */
  useEffect(() => {
    // start streams execution
    dispatch(streamsActions.startStreams());

    return () => {
      dispatch(streamsActions.endStreams());
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  /**
   * calculate frame size
   */
  useEffect(() => {
    const div = wrapperRef.current;

    // get wrapper div
    if (div) {
      setSizes(getSizeForDiv(div));
    }
  }, []);

  return (
    <div className={classes.wrapper} ref={wrapperRef}>
      <div className={classes.frame}>Div....</div>
    </div>
  );
};

const IndexHandler: FunctionComponent<RouteComponentProps> = () => {
  const { path } = useRouteMatch();
  return (
    <Switch>
      <Route exact path={path} component={IndexPage} />
    </Switch>
  );
};

export default IndexHandler;
