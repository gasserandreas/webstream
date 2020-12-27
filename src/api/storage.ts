function isLocalStorageSupported(): Promise<boolean> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}

const API = {
  isLocalStorageSupported,
};

export default API;
