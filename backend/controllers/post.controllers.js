const PostModel = require('../models/post.model');
const userModel = require('../models/user.model');

const User = require('../models/user.model'); // Assure-toi du bon chemin vers ton modèle

const bcrypt = require('bcrypt');

module.exports.getPosts = async (req, res) => {
    const post = await PostModel.find();
    res.status(200).json(post);
}

module.exports.editPost = async (req, res) => {
    const post = await PostModel.findById(req.params.id)

    if (!post) {
        res.status(400).json({message: "ce poste n'existe pas"})
    }

    const updatePost = await PostModel.findByIdAndUpdate(
        post,
        req.body,
        {
            new: true
        }
    )

    res.status(200).json(updatePost);
}

module.exports.deletePost = async (req, res) => {
    const post = await PostModel.findByIdAndDelete(req.params.id);
    
    if (!post) {
        res.status(400).json({message: "ce poste n'existe pas"})
    }
    
    await post.deleteOne();

    res.status(200).json({message: "ce poste à été supprimer id = " + req.params.id});
}

module.exports.setPosts = async (req, res) => {
    if(!req.body.message) {
        res.statut(400).json({message: "ajouter du texte svp !!"});
    }

    const post = await PostModel.create({
        message: req.body.message,
        author: req.body.author
    })
    res.status(200).json(post);

}

module.exports.likePost = async (req, res) => {
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $addToSet: { liker: req.body.userId} 
            },
            { 
                new: true
            }
        ).then((data) => res.status(200).send(data));

    }catch(err) {
        res.status(500).json({message: err.message})
    }
}

module.exports.dislikePost = async (req, res) => {
    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $pull: { liker: req.body.userId} 
            },
            { 
                new: true
            }
        ).then((data) => res.status(200).send(data));

    }catch(err) {
        res.status(500).json({message: err.message})
    }
}

module.exports.signup = async (req, res) => {
    let { name, email, password } = req.body;
    name = name.trim();
    email = email.trim();
    password = password.trim();

    if (name == "" || email == "" || password == "") {
        res.json({
            status: "Failed",
            message: "Empty input fields"
        });
    } else if (!/^[a-zA-Z0-9]*$/.test(name)) {
        res.json({
            status: "Failed",
            message: "Invalid name format"
        });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        res.json({
            status: "Failed",
            message: "Invalid e-mail format"
        });
    } else if (password.length < 8) {
        res.json({
            status: "Failed",
            message: "Password must be at least 8 characters long"
        });
    }else {
        //check if user already exists
        User.find({email}).then(result => {
            if (result.length) {
                res.json({
                    status: "Failed",
                    message: "Email already exists"
                });
            }else {
                //hash passwords and create new user
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) throw err;
                    let newUser = new User({
                        name,
                        email,
                        password: hashedPassword
                    });
                    newUser.save();
                    res.json({
                        status: "Success",
                        message: "User created successfully",
                        data: result,
                    });
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "Failed",
                message: "Error in checking user existence"
            });
        })
    }
}

module.exports.login = async (req, res) => {
    let { email, password } = req.body;
    email = email.trim();
    password = password.trim();

    if (email == "" || password == "")  {
        res.json({
            status: "Failed",
            message: "Empty input fields"
        });
    } else {
        //check if user exists
        User.findOne({email}).then(user => {
            if (!user) {
                res.json({
                    status: "Failed",
                    message: "User not found"
                });
            } else {
                //compare hashed passwords
                bcrypt.compare(password, user.password, (err, result) => {
                    if (err) throw err;
                    if (result) {
                        res.json({
                            status: "Success",
                            message: "Login successful",
                            data: user
                        });
                    } else {
                        res.json({
                            status: "Failed",
                            message: "Incorrect password"
                        });
                    }
                });
            }
        }).catch(err => {
            console.log(err);
            res.json({
                status: "Failed",
                message: "Error in checking user existence"
            });
        })
    }
}