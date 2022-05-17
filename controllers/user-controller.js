const {
    User
} = require('../models');

const userController = {

//GET all users
    getAllUsers(req, res) {
        User.find({})
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

//GET one user by id
    getUserById({
        params
    }, res) {
        User.findOne({
                _id: params.id
            })
            .populate({
                path: 'friends',
                select: '-__v'
            })
            .populate({
                path: 'thoughts',
                select: '-__v'
            })
            .select('-__v')
            .then(dbUserData => res.json(dbUserData))
            .catch(err => {
                console.log(err);
                res.sendStatus(400);
            });
    },

//CREATE user
    createUser({
        body
    }, res) {
        User.create(body)
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.status(400).json(err));
    },

//UPDATE user by id
    updateUser({
        params,
        body
    }, res) {
        User.findOneAndUpdate({
                _id: params.id
            }, body, {
                new: true
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

//DELETE user
    deleteUser({
        params
    }, res) {
        User.findOneAndUpdate({
                _id: params.id
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

//ADD friends
    addFriend({
        params
    }, res) {
        User.findOne({
            _id: params.userId
        }).then(user => {
            if (user.friends.includes(params.friendId)) {
                res.status(500).send('Users are already friends.')
            }
        });

        User.findOneAndUpdate({
                _id: params.userId
            }, {
                $push: {
                    friends: params.friendId
                }
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    },

//DELETE friend
    deleteFriend({
        params
    }, res) {
        User.findOneAndDelete({
                _id: params.userId
            }, {
                $pull: {
                    friends: params.friendId
                }
            }, {
                new: true
            })
            .then(dbUserData => {
                if (!dbUserData) {
                    res.status(404).json({
                        message: 'No user found with this id.'
                    });
                    return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.status(400).json(err));
    }
}

module.exports = userController; 