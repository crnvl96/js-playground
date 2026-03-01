function runGame() {
  let turn = 0;
  let bountyCards = [1, 2, 3, 4, 5, 6, 7, 8];
  let playerCards = [
    [1, 2, 3, 4, 5, 6, 7, 8],
    [1, 2, 3, 4, 5, 6, 7, 8],
  ];
  let playerScores = [0, 0];

  function popRandom(arr) {
    const idx = Math.floor(Math.random() * arr.length);
    arr.splice(idx, 1);
    return arr[idx];
  }

  function playRandomStrategy(playerCards) {
    const card = popRandom(playerCards);
    console.log(`\tPlayer 0 plays: ${card}`);
    return card;
  }

  function playEqualStrategy(playerCards, bountyCard) {
    playerCards.splice(playerCards.indexOf(bountyCard), 1);
    console.log(`\tPlayer 1 plays: ${bountyCard}`);
    return bountyCard;
  }

  while (bountyCards.length > 0) {
    const bountyCard = popRandom(bountyCards);
    console.log(`Turn ${turn}: Bounty: ${bountyCard}`);
  }
}
