module.exports = {
  capitalize(str) {
    const words = str.split(" ");
    const capitalizedWords = words.map((word) => {
      const chars = word.split("");
      chars[0] = chars[0].toUpperCase();
      return chars.join("");
    });

    return capitalizedWords.join(" ");
  },
};
