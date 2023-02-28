const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const existingUser = await User.findOne({ email });
        
        if (!existingUser) {
            return res
                    .status(404)
                    .json({message: "User Doesn't Exist"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return res
                    .status(404)
                    .json({message: "invalid username / password"});
            
        }
        const token = jwt.sign({email: existingUser.email, id: existingUser._id}, process.env.KEY, {expiresIn: "3d"});
        console.log("cookie = ", token);
        res 
            .cookie("access_token", token, {
                    httpOnly: true,
                    secure: true,
                    expiresIn:"3d"
            })
        return res
                .status(200)
                .json({existingUser, token});
    } catch (err) {
        console.log(err);
        return res 
                .status(500)
                .json({data: {
                    message: "Internal Server Error"
                }})
    }
}

const registerUser = async (req, res) => {
    try {
        const salt = bcrypt.genSaltSync(14);
        const hash = bcrypt.hashSync(req.body.password, salt)
        
        const existingUser = User.find({email: req.body.email})
        if (existingUser === req.body.email) {
            return res
                    .status(401)
                    .json({
                        message: "Hey bro user already exists"
                    })
        }
        const newUser = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hash
        });
        const token = jwt.sign({email: newUser.email,id: newUser._id}, process.env.KEY, {expiresIn: '3d'});
         
        return res.status(201)
                    .json({newUser, token})
        
    } catch (err) {
        console.log(err);
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const deleteUsers = async (req, res) => {
    try {
        await User.deleteMany()
        return res
                .status(200)
                .json({
                    message: "All The Users Are Succeessfully Deleted"
                })
    } catch (err) {
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const getUsers = async (req, res) => {
    try {
        const users = await User.find();
        return res
                .status(200)
                .json(users)
    } catch (err) {
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const getSpecificUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const specificUser = await User.findById(userId);

        if (!specificUser) {
            return res
                    .status(404)
                    .json({
                        message: "wrong user id entered"
                    })
        }

        return res  
                .status(200)
                .json(specificUser)

    } catch (err) {
        return res
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}

const updateUser = async (req, res) => {
    try {

    } catch (err) {
        return res  
                .status(500)
                .json({
                    message: "Internal Server Error"
                })
    }
}


module.exports = {
    loginUser,
    registerUser,
    deleteUsers,
    getUsers,
    getSpecificUser
}