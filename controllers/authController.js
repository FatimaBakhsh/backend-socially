import fs from "fs";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const dbPath = "./database/users.json";

export const signup = (req, res) => {
    const { email, password } = req.body;

    let users = JSON.parse(fs.readFileSync(dbPath));

    if (users[email]) {
        return res.status(400).json({ message: "User already exists" });
    }

    const hashed = bcrypt.hashSync(password, 10);

    users[email] = { email, password: hashed };

    fs.writeFileSync(dbPath, JSON.stringify(users, null, 2));

    return res.status(200).json({ message: "Signup successful" });
};

export const login = (req, res) => {
    const { email, password } = req.body;

    let users = JSON.parse(fs.readFileSync(dbPath));

    const user = users[email];

    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = bcrypt.compareSync(password, user.password);

    if (!isMatch)
        return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign({ email }, "secret123");

    return res.status(200).json({ message: "Login successful", token });
};
