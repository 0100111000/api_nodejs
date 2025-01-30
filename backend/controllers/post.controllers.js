const PostModel = require('../models/post.model');

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