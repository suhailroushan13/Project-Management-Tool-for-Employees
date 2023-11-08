export function generateRandomPassword(length) {
  if (length < 8) {
    return "Password length must be at least 8 characters";
  }

  const upperCaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowerCaseChars = "abcdefghijklmnopqrstuvwxyz";
  const specialChars = "!@#$%&*?";
  const numberChars = "0123456789";

  function getRandomChar(characters) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  }

  const password = [
    getRandomChar(upperCaseChars),
    getRandomChar(lowerCaseChars),
    getRandomChar(specialChars),
    getRandomChar(numberChars),
  ];

  const remainingLength = length - password.length;
  const allCharacters =
    upperCaseChars + lowerCaseChars + specialChars + numberChars;
  for (let i = 0; i < remainingLength; i++) {
    password.push(getRandomChar(allCharacters));
  }

  for (let i = password.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [password[i], password[j]] = [password[j], password[i]];
  }

  return password.join("");
}

// import { generateRandomPassword } from "./randomPasswordGenerator.js";

const password = generateRandomPassword(1); // Change 12 to your desired password length
console.log(password);
