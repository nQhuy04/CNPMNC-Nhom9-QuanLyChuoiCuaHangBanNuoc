const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


let refreshTokens = [];
const authController = {
    registerUser: async(req, res)=>{
        try{
            const salt = await bcrypt.genSalt(10);
            const hashed = await bcrypt.hash(req.body.password, salt);
            const newUser = await new User({
                username: req.body.username,
                email: req.body.email,
                password: hashed,
            });
            const user = await newUser.save();
            res.status(201).json(user);
        }catch(err){
            res.status(500).json(err);
        }
    },
    //generate access token
    generateAccessToken: (user)=>{
        return jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        {expiresIn: "30s"}
        );
    },
    //generate refresh token
    generateRefreshToken: (user)=>{
        return jwt.sign({
            id: user.id,
            isAdmin: user.isAdmin
        },
        process.env.JWT_SECRET,
        {expiresIn: "365d"}
        );
    },
    //Login
    loginUser: async(req, res)=>{
        try {
            const user = await User.findOne({username: req.body.username});
            if(!user){
                return res.status(404).json("Sai username");
            }
            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(!validPassword){
                return res.status(404).json("Sai password");
            }
            if(user && validPassword){
                const accessToken = authController.generateAccessToken(user);
                const refreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(refreshToken);
                //Saving cookie
                res.cookie("refreshToken", refreshToken,{
                    httpOnly: true,
                    path:"/",
                    sameSite: "strict",
                    secure: false
                })
                const {password, ...others} = user._doc;
                res.status(200).json({...others, accessToken});
            }

        } catch (err) {
            res.status(500).json(err);
        }
    },
    requestRefreshToken: async(req, res)=>{
        const refreshToken = req.cookies.refreshToken;
        if(!refreshToken) return res.status(401).json("You're not auth");
        if(!refreshTokens.includes(refreshToken)){
            return res.status(403).json("RefreshToken is not valid");
        }
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, user)=>{
            if(err){
                console.log(err);
            }
                refreshTokens = refreshTokens.filter((token)=> token !== refreshToken);
                const newAccessToken = authController.generateAccessToken(user);
                const newRefreshToken = authController.generateRefreshToken(user);
                refreshTokens.push(newRefreshToken);
                res.cookie("refreshToken", newRefreshToken,{
                    httpOnly: true,
                    path:"/",
                    sameSite: "strict",
                    secure: false
                });
                res.status(200).json({accessToken: newAccessToken});
        });
    },
    userLogout: async(req, res)=>{
        res.clearCookie("refreshToken");
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        res.status(200).json("Đăng xuất thành công");
    }
};
module.exports = authController;