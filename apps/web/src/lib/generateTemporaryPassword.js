/**
 * Generates a random 8-12 character password with a mix of uppercase, 
 * lowercase, numbers, and special characters.
 * @returns {string} The generated temporary password
 */
export const generateTemporaryPassword = () => {
  const length = Math.floor(Math.random() * (12 - 8 + 1)) + 8; // Random length between 8 and 12
  
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specials = "!@#$%^&*()_+~`|}{[]:;?><,./-=";
  const allChars = uppercase + lowercase + numbers + specials;
  
  let password = "";
  
  // Ensure at least one character of each type
  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += specials[Math.floor(Math.random() * specials.length)];
  
  // Fill the rest randomly
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle the password characters to avoid predictable patterns
  const finalPassword = password.split('').sort(() => 0.5 - Math.random()).join('');
  
  console.log('[DEBUG] Generated temporary password:', finalPassword);
  return finalPassword;
};