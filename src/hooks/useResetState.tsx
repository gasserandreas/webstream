import { useState, useEffect, useRef } from 'react';

type UseResetStateProps<T> = {
  time?: number;
  initialState?: T;
};

// type TimeoutType = ReturnType<typeof setTimeout>;

interface RefType<T> {
  current: T;
}

function cleanup(timeoutRef?: RefType<number | null>) {
  if (timeoutRef?.current) {
    clearTimeout(timeoutRef?.current);
  }
}

const initialProps: UseResetStateProps<null> = {
  time: 5000,
  initialState: null,
};

function useResetState<T>(
  props: UseResetStateProps<T | null> = initialProps
): [T | null, (newState: T) => void] {
  const { time, initialState } = props;
  const [state, setState] = useState<T | null>(initialState || null);

  const timeoutRef: RefType<number | null> = useRef(null);

  useEffect(() => {
    return () => {
      cleanup(timeoutRef);
    };
  }, []);

  const handleSetState = (newState: T) => {
    // cleanup first
    cleanup(timeoutRef);

    // create new timeout
    timeoutRef.current = window.setTimeout(() => {
      setState(initialState || null);
    }, time);

    setState(newState);
  };

  return [state, handleSetState];
}

export default useResetState;
