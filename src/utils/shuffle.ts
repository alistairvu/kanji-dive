export function shuffleArray<T>(array: T[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    if (array[j] === undefined) {
      continue;
    }

    [array[i], array[j]] = [array[j] as T, array[i] as T];
  }
}
