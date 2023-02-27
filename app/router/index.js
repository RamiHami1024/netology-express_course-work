const express = require('express');
const router = express.Router();
const {UserModule} = require('../modules/user');
const {AdvertisementModule} = require('../modules/advertisement');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const uploader = require('../middlewares/uploader');
const {ChatModule} = require('../modules/chat');
const path = require('path');
const Chat = require('../models/Chat');

async function genPasswordHash(password) {
    return bcrypt.hash(password, 10);
};

router.post('/signup', async (req, res) => {
    try {
        const user = await UserModule.create({
            ...req.body,
            passwordHash: await genPasswordHash(req.body.password)
        });
        const {email, id, name, contactPhone, passwordHash} = user;

        res.status(200).json({
            status: "ok",
            user: {
                email, id,
                name, contactPhone, passwordHash
            }
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 400,
            message: error
        });
    }
});  

router.post('/signin', 
    passport.authenticate('local', {failureMessage: "Not found"}),
    (req, res) => {
        res.status(200).json({
            message: "success",
            user: req.user
        })
})

router.get('/find-user', async (req, res) => {
    try {
        const user = await UserModule.findByEmail(req.body.email);
        console.log(user._id.toString())
        res.status(200).json({
            status: 200,
            message: user
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 400,
            message: error
        });
    }
});

router.post('/advertisements', uploader.array('image', 10), async (req, res) => {
    let files = [];
    if (!req.isAuthenticated()) {
        return res.status(401).json({
            status: "error",
            message: "Not Authenticated."
        });
    }

    if (req.files) {
        files = req.files.map(item => item.path);
    }

    try {
        const ads = await AdvertisementModule.create({
            ...req.body,
            images: files
        });

        res.status(200).json({
            status: 200,
            message: ads
        })
    } catch (error) {
        console.log(error, "HERE");
        res.status(400).json({
            status: 400,
            message: error
        })
    }
});

router.get('/advertisements', async (req, res) => {
    try {
        const ads = await AdvertisementModule.find(req.body);

        res.status(200).json({
            status: "ok",
            data: ads,
        })
    } catch (error) {
        console.log(error);
        res.status(400).json({
            status: 400,
            message: error
        })
    }
});

router.get('/advertisements/:id', async (req, res) => {
    const {id} = req.params;
    
    try {
        const ads = await AdvertisementModule.findById(id);

        res.status(200).json({
            status: "ok",
            data: ads,
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: error
        });
    }
});

router.delete(
    '/advertisements/:id', 
    async (req, res) => {
        const {id} = req.params;
        
        if (!req.isAuthenticated()) {
            return res.status(401).json({
                status: "error",
                message: "Not Authenticated."
            });
        }

        try {
            const post = await AdvertisementModule.findById(id);
            const sessionUserId = req.user.id;
            const createrId = post[0].userId;

            if (sessionUserId !== createrId.toString()) {
                return res.status(403).json({
                    status: "decline",
                    message: "Вы не можете удалить этот пост."
                });
            }

            if (post[0].isDeleted) {
                return res.status(403).json({
                    status: "decline",
                    message: "Пост уже удален."
                });
            }

            await AdvertisementModule.remove(post[0]._id);

            res.status(200).json({
                message: `Запись с id: ${post[0]._id} успешно удалена.`
            });
        } catch (error) {
            res.status(400).json({
                status: "error",
                message: error
            });
        }
});

router.get('/chats', async (req, res) => {
    try {
        const chats = await Chat.find();

        res.status(200).json({
            data: chats
        });
    } catch (error) {
        res.status(400).json({
            status: "error",
            error: error
        });
    }
});

router.get('/main', async (req, res) => {
    res.sendFile(path.resolve(__dirname, 'index.html'));
});

router.post('/create-chat', async (req, res) => {
    const user1 = await UserModule.create({
        email: String(getRandomInt(12312321)),
        passwordHash: await genPasswordHash(String(getRandomInt(12312321))),
        name: "Gena",
    });
    const user2 = await UserModule.create({
        email: getRandomInt(12312321),
        passwordHash: await genPasswordHash(String(getRandomInt(12312321))),
        name: "Gosha",
    });
    const idUser1 = user1._id;
    const idUser2 = user2._id;

    user1.save();
    user2.save();

    const chat = await ChatModule.sendMessage(idUser1, idUser2, 'text');

    res.status(200).json(chat);
})

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

module.exports = router;