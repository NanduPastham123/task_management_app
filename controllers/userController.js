import User from '../models/user.js';
export const createNewRegistrationForUser = async (req, res) => {
    try {
        //parse the request details from user to validate it 
        const { username, email, password, role, isActive } = req.body;
        // intially we need check if user already exists
        const existingTaskUser = await User.findOne({ email });
        if (existingTaskUser) return res.status(400).json({ message: 'Email already in use' });
        const newTaskUser = new User({ username, email, password, role, isActive });
        await newTaskUser.save();
        res.status(201).json(newTaskUser);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
}

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().lean();
        res.status(200).json(users);
    } catch (err) {
        console.log("error: " + err.message)
        res.status(500).json({ message: 'Server error' });
    }
}

export const getAllUsersWithPagination = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const users = await User.find()
            .skip((page - 1) * limit)  // Skip users based on page number
            .limit(Number(limit));     // Limit the number of users per page

        const totalUsers = await User.countDocuments();  // Get total count for pagination
        res.status(200).json({
            users,
            totalUsers,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: page
        });
    } catch (err) {
        console.log("error: " + err.message)
        res.status(500).json({ message: 'Internal Server error' });
    }
}


export const generateTokenForLoggedInUser = async (req, res) => {
    try {
        console.log("ComesTOGenerateToken")
        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid email or password' });

        // Check if password matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

        // Generate JWT
        const token = user.generateAuthToken();
        res.status(200).json({ token, user: { id: user._id, email: user.email, role: user.role } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
