export function use301Games() {
  const games: GameState[] = [];

  for (const i in localStorage) {
    if (i.startsWith("game-301-")) {
      games.push(JSON.parse(localStorage.getItem(i) as string) as GameState);
    }
  }
  games.sort((a, b) => b.createdAt - a.createdAt);

  return ref(games);
}
