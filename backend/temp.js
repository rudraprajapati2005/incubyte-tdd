// First, generate a bcrypt hash for the password
// In Node REPL or a small script:
import bcrypt from "bcryptjs"
bcrypt.hash("pass123", 10).then(console.log);

// Suppose the output is: "$2a$10$abc123hashedPasswordString"
