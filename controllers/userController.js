import User from '../models/user.js';
import { hash } from 'bcrypt';
import jwt from 'jsonwebtoken';

export async function createUser(req, res) {
    try {
        const { username, email, password } = req.body;
        const hashedPassword = await hash(password, 10);
        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export async function getUsers(req, res) {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
