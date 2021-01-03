import React, { useRef, useEffect, useState, FunctionComponent } from 'react';

import {
  Switch,
  Route,
  useRouteMatch,
  useHistory,
  RouteComponentProps,
} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { makeStyles, createStyles } from '@material-ui/core/styles';

import CachedIcon from '@material-ui/icons/Cached';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';

import SettingsIcon from '@material-ui/icons/Settings';

import { streamsActions } from '../../entities/streams/index';
import {
  shouldRenderEvenSelector,
  shouldRenderOddSelector,
  shouldShowEvenSelector,
  shouldShowOddSelector,
  evenStreamSelector,
  oddStreamSelector,
} from '../../entities/streams/selectors';

import IFrame from '../../ui/iFrame';
import Navigation from '../../ui/navigation';
import NavItem from '../../ui/navigation/item';

import { SETTINGS } from '../../constants/paths';

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
  const history = useHistory();

  const shouldRenderEven = useSelector(shouldRenderEvenSelector);
  const shouldRenderOdd = useSelector(shouldRenderOddSelector);
  const shouldShowEven = useSelector(shouldShowEvenSelector);
  const shouldShowOdd = useSelector(shouldShowOddSelector);
  const evenStream = useSelector(evenStreamSelector);
  const oddStream = useSelector(oddStreamSelector);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const [sizes, setSizes] = useState<SizeDefinition | null>(null);

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

  function getOpacityStyles(visible: boolean) {
    const opacity = visible ? 1 : 0;
    return {
      opacity,
    };
  }

  const unSupportedAction = (func: string) => () => {
    // eslint-disable-next-line no-console
    console.log(`${func} not yet implemented`);
  };

  return (
    <div className={classes.wrapper} ref={wrapperRef}>
      <Navigation
        bottomElements={[
          <NavItem onClick={() => history.push(SETTINGS)}>
            <SettingsIcon />
          </NavItem>,
        ]}
      >
        <NavItem
          key="nav-item-reload"
          onClick={unSupportedAction('reload')}
          disabled
        >
          <CachedIcon />
        </NavItem>
        <NavItem
          key="nav-item-next"
          onClick={unSupportedAction('next')}
          disabled
        >
          <ArrowLeftIcon />
        </NavItem>
        <NavItem
          key="nav-item-prev"
          onClick={unSupportedAction('prev')}
          disabled
        >
          <ArrowRightIcon />
        </NavItem>
      </Navigation>
      <div className={classes.frame} style={getOpacityStyles(shouldShowEven)}>
        {(shouldRenderEven || shouldShowEven) && (
          <IFrame
            link={evenStream.value}
            width={sizes?.width}
            height={sizes?.height}
          />
        )}
      </div>
      <div className={classes.frame} style={getOpacityStyles(shouldShowOdd)}>
        {(shouldRenderOdd || shouldShowOdd) && (
          <IFrame
            link={oddStream.value}
            width={sizes?.width}
            height={sizes?.height}
          />
        )}
      </div>
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
