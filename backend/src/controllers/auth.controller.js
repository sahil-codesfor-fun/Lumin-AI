import fs from "fs";
import path from "path";

const usersFile = path.join(process.cwd(), "src/storage/users.json");

const readUsers = () => JSON.parse(fs.readFileSync(usersFile));
const saveUsers = (data) => fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));

export const register = (req, res) => {
  const users = readUsers();
  const { email, password } = req.body;

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: "User already exists" });
  }

  users.push({ id: Date.now(), email, password });
  saveUsers(users);

  res.json({ message: "Registered successfully" });
};

export const login = (req, res) => {
  const users = readUsers();
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful", user });
};
