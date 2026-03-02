/** Default deck of bounty cards. */
const DECK = [1, 2, 3, 4, 5, 6, 7, 8];

/**
 * Returns a copy of the array with the first occurrence of value removed.
 * If value is not in the array, returns a copy of the array unchanged.
 * @param {number[]} arr
 * @param {number} value
 * @returns {number[]}
 */
function without(arr, value) {
  const idx = arr.indexOf(value);
  if (idx === -1) {
    return [...arr];
  }
  return [...arr.slice(0, idx), ...arr.slice(idx + 1)];
}

/**
 * Returns a random element from a non-empty array using the provided RNG.
 * @param {number[]} arr - Must have length > 0
 * @param {() => number} [rng=Math.random]
 * @returns {number}
 * @throws {Error} If arr is empty
 */
function selectRandom(arr, rng = Math.random) {
  if (arr.length === 0) {
    throw new Error("selectRandom: array must not be empty");
  }
  const idx = Math.floor(rng() * arr.length);
  return arr[idx];
}

/**
 * @param {number[]} playerCards
 * @param {() => number} [rng=Math.random]
 * @returns {number}
 */
function playRandomStrategy(playerCards, rng = Math.random) {
  return selectRandom(playerCards, rng);
}

/**
 * @param {number} bountyCard
 * @returns {number}
 */
function playEqualStrategy(bountyCard) {
  return bountyCard;
}

/**
 * @param {[number, number]} playerScores
 * @returns {string}
 */
function winMessage(playerScores) {
  if (playerScores[0] === playerScores[1]) {
    return "Players Tie!";
  }
  if (playerScores[0] < playerScores[1]) {
    return "Player 1 wins!";
  }
  return "Player 0 wins!";
}

/**
 * @param {[number, number]} playerScores
 * @returns {string}
 */
function scoreMessage(playerScores) {
  return `Scores: ${playerScores[0]} vs ${playerScores[1]}`;
}

/**
 * @param {[number, number]} playerScores
 * @returns {string}
 */
function endMessage(playerScores) {
  return `${scoreMessage(playerScores)}\n${winMessage(playerScores)}`;
}

/**
 * @param {[number, number]} playerScores
 * @param {[number, number]} playedCards
 * @returns {[number, number]}
 */
function newScores(playerScores, playedCards) {
  if (playedCards[0] > playedCards[1]) {
    return [playerScores[0] + 1, playerScores[1]];
  }
  if (playedCards[0] < playedCards[1]) {
    return [playerScores[0], playerScores[1] + 1];
  }
  return [playerScores[0], playerScores[1]];
}

/**
 * Builds the next game state from the current state.
 * @param {Object} state - Current game state (must include strategies and rng)
 * @returns {Object} Next state
 */
function nextState(state) {
  const rng = state.rng;
  const bountyCard = selectRandom(state.bountyCards, rng);
  const card0 = state.strategies[0](state.playerCards[0], rng);
  const card1 = state.strategies[1](bountyCard);

  return {
    ...state,
    turn: state.turn + 1,
    lastBountyCard: bountyCard,
    lastPlayedCards: [card0, card1],
    bountyCards: without(state.bountyCards, bountyCard),
    playerCards: [
      without(state.playerCards[0], card0),
      without(state.playerCards[1], card1),
    ],
    playerScores: newScores(state.playerScores, [card0, card1]),
  };
}

/**
 * @param {Object} state - Game state with lastBountyCard and lastPlayedCards
 * @returns {string}
 */
function turnMessage(state) {
  return `Turn ${state.turn}:
  \tBounty: ${state.lastBountyCard}
  \tPlayer 0 plays: ${state.lastPlayedCards[0]}
  \tPlayer 1 plays: ${state.lastPlayedCards[1]}`;
}

/**
 * @param {Array} arr
 * @returns {*}
 */
function last(arr) {
  return arr[arr.length - 1];
}

/**
 * Builds the game report: one line per played turn (excluding initial state), then the end message.
 * @param {Object[]} states - All states from initial to final
 * @param {(state: Object) => string} onTurn
 * @param {(state: Object) => string} onEnd
 * @returns {string}
 */
function report(states, onTurn, onEnd) {
  const playedStates = states.slice(1);
  return `${playedStates.map(onTurn).join("\n")}\n${onEnd(last(states))}`;
}

/**
 * Iteratively builds the list of states until endCondition is true.
 * Uses a loop to avoid stack overflow in engines without TCO.
 * @param {Object[]} states - Accumulated states
 * @param {(state: Object) => Object} stateChange
 * @param {(state: Object) => boolean} endCondition
 * @returns {Object[]}
 */
function runUntil(states, stateChange, endCondition) {
  let current = states;
  while (!endCondition(last(current))) {
    current = current.concat(stateChange(last(current)));
  }
  return current;
}

/**
 * Creates the initial game state.
 * @param {{ strategies?: [(playerCards: number[], rng?: () => number) => number, (bountyCard: number) => number], rng?: () => number }} [options]
 * @returns {Object}
 */
function initialState(options = {}) {
  const strategies = options.strategies ?? [
    playRandomStrategy,
    playEqualStrategy,
  ];
  const rng = options.rng ?? Math.random;
  return {
    turn: 1,
    lastBountyCard: null,
    lastPlayedCards: [null, null],
    bountyCards: [...DECK],
    playerCards: [[...DECK], [...DECK]],
    playerScores: [0, 0],
    strategies,
    rng,
  };
}

/**
 * Runs a single game and returns the list of states (initial + one per turn).
 * @param {{ strategies?: [(playerCards: number[], rng?: () => number) => number, (bountyCard: number) => number], rng?: () => number }} [options]
 * @returns {Object[]}
 */
function runGame(options = {}) {
  const states = [initialState(options)];
  return runUntil(states, nextState, (state) => state.bountyCards.length === 0);
}

console.log(report(runGame(), turnMessage, (state) => endMessage(state.playerScores)));
