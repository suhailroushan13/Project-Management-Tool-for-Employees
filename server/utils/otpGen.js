function otpGen(length) {
  // Initialize an empty OTP string
  let otp = "";

  // Loop for the given length
  for (let i = 0; i < length; i++) {
    // Generate a random digit between 0 and 9
    let digit = Math.floor(Math.random() * 10);
    // Append the digit to the OTP string
    otp += digit;
  }

  return otp;
}

// Example usage
export default otpGen;
