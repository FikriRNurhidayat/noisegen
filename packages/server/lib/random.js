// See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values_inclusive
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomItem(array) {
  return array[getRandomIntInclusive(0, array.length - 1)];
}

module.exports = {
  getRandomIntInclusive,
  getRandomItem,
};
