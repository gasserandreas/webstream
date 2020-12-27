export function getNextIndex(index: number, length: number): number {
  let nextIndex = index + 1;

  if (nextIndex >= length) {
    nextIndex = 0;
  }

  return nextIndex;
}

export function empty(): void {}
