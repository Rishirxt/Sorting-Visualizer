export const createSleep = (pausedRef) => {
  return async function controlledSleep(ms) {
    const step = 50; // check every 50ms
    let elapsed = 0;
    while (elapsed < ms) {
      if (pausedRef.current) {
        await new Promise((resolve) => {
          const checker = setInterval(() => {
            if (!pausedRef.current) {
              clearInterval(checker);
              resolve();
            }
          }, 50);
        });
      } else {
        const wait = Math.min(step, ms - elapsed);
        await new Promise((res) => setTimeout(res, wait));
        elapsed += wait;
      }
    }
  };
};
