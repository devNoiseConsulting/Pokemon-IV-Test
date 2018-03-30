const { findPokemon, getAllPokemon } = require('pokemagic/dex');
const calculateIV = require('pokemagic/calculateIV');
const parseIV = require('pokemagic/lib/parseIV');
const Levels = require('pokemagic/json/levels');
const getCP = require('pokemagic/lib/getCP');

const matches = calculateIV(
  findPokemon('MEWTWO'), // Pokemon
  3982, // CP
  164, // HP
  40 // Level
);

// console.log(matches);
// console.log(findPokemon('MEWTWO'));

const calcBulbasaur = function() {
  const ivStats = Array(4096)
    .fill(0)
    .map((_, i) => i)
    .filter(v => v > 272);

  const pokemon = getAllPokemon();
  console.log(pokemon.length);

  const levels = Object.keys(Levels);
  console.log(levels.length);
  let bulbasaur = [pokemon[0]];
  console.log(bulbasaur);
  bulbasaur = bulbasaur.map(mon => {
    mon.cpValues = ivStats
      .map(iv => levels.map(level => [getCP(mon, iv, Levels[level]), iv]))
      .reduce((acc, cpLevel) => {
        cpLevel.forEach(([cp, iv]) => {
          if (acc[cp]) {
            acc[cp].push(iv);
          } else {
            acc[cp] = [iv];
          }
        });
        return acc;
      }, []);
    return mon;
  });
  // console.log(bulbasaur[0].cpValues[780]);

  return bulbasaur;
};

const possibleIVs = function(pokemon, cp, hp) {
  const levels = Object.keys(Levels).reverse();
  let matches = levels
    .map(l =>
      calculateIV(pokemon, cp, hp, l).map(s => {
        s.lvl = parseFloat(l);
        s.pct = Math.round((s.atk + s.def + s.sta) / 45 * 10000) / 100;
        return s;
      })
    )
    .reduce((acc, m) => [...acc, ...m], []);
  return matches;
};

const bulbMatches = possibleIVs(findPokemon('BULBASAUR'), 780, 73);
console.log(bulbMatches);
console.log(bulbMatches.length);
