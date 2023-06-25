const _ = require("lodash");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncMiddleware = require("../middleware/async");
const { User, MessageData, Message, ChatData, UserChat, Reply, Forward, Score, View, Comment, RumorChat, ContactChat } = require("../models");
const { validateIdData, validateUserEditData, validateMessageData, validateReplyData, validateForwardData, validateScoreData, validateViewData, validateRumorData, validateInitialMessageData, validateInteractData } = require("../validators/user");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { Op } = require('sequelize');
const express = require("express");
const { DATE } = require('sequelize');
const router = express.Router();

router.get("/info", auth, asyncMiddleware(async (req, res) => {
    
    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    res.status(200).json({
        data: user,
        message: "User info retrieved successfully!",
        status: "ok"
    });
}));

router.post("/interact", auth, validate(validateInteractData), asyncMiddleware(async (req, res) => {

    UserChat.update({
        lastViewedMessageId: req.body.lastViewedMessageId,
        currentScrollMessageId: req.body.currentScrollMessageId
    },{
        where: {
            userId: req.user.id,
            chatId: req.body.chatId,
            chatType: req.body.chatType
        }
    })

    res.status(200).json({
        message: "Interact applied successfully!",
        status: "ok"
    });
}));

router.post("/message", auth, multer({ dest: "resources/image" }).single("image"), validate(validateMessageData), asyncMiddleware(async (req, res) => {
    
    // Fixing the image extension
    let uniqueFilename = null;
    if (req.file) {
        const originalName = req.file.originalname;
        const fileExtension = path.extname(originalName);
        uniqueFilename = `${req.file.filename}${fileExtension}`;
        const newPath = path.join(path.resolve(__dirname, ".."), 'resources/image', uniqueFilename);
        const oldPath = path.join(path.resolve(__dirname, ".."), req.file.path);
        fs.renameSync(oldPath, newPath);
    }

    // Creating new messageData
    const newMessageData = await MessageData.create({
        userId: req.user.id,
        image: uniqueFilename,
        message: (req.body.message != undefined ? req.body.message : null),
        score: 0,
        scoreCount: 0,
        viewCount: 0,
        replyCount: 0,
        forwardCount: 0,
        commentCount: 0,
        isRepliable: true,
        isForwardable: true,
        isCommentable: false,
        isScorable: false,
        isViewable: false,
        isRedirectable: false
    });

    const newMessage = await Message.create({
        messageDataId: newMessageData.id,
        userId: req.user.id,
    });

    await ChatData.create({
        chatId: req.body.chatId,
        chatType: req.body.chatType,
        messageId: newMessage.id,
        messageType: "message"
    });
    
    if (req.body.chatType == "rumor") {
        const rumorChat = await RumorChat.findOne({
            where: { 
                id: req.body.chatId
            }
        });

        const userChat = await UserChat.findOne({
            where: { 
                userId: req.user.id,
                chatId: rumorChat.id,
                chatType: "rumor"
            }
        });

        if (userChat == null) {
            await UserChat.create({
                userId: req.user.id,
                chatId: rumorChat.id,
                chatType: "rumor",
                lastViewedMessageId: newMessage.id,
                currentScrollMessageId: newMessage.id
            });
        }

        await Comment.create({
            userId: req.user.id,
            messageDataId: rumorChat.messageDataId,
            messageId: newMessage.id,
            messageType: "message"
        });

        const messageData = await MessageData.findOne({
            where: {
                id: rumorChat.messageDataId
            }
        });

        await MessageData.update(
            {
                commentCount: messageData.commentCount + 1
            },
            {
                where: {
                    id: messageData.id
                }
            }
        );
    }

    res.status(200).json({
        message: "New message created successfully!",
        status: "ok"
    });
}));

router.post("/reply", auth, multer({ dest: "resources/image" }).single("image"), validate(validateReplyData), asyncMiddleware(async (req, res) => {
    
    // Fixing the image extension
    let uniqueFilename = null;
    if (req.file) {
        const originalName = req.file.originalname;
        const fileExtension = path.extname(originalName);
        uniqueFilename = `${req.file.filename}${fileExtension}`;
        const newPath = path.join(path.resolve(__dirname, ".."), 'resources/image', uniqueFilename);
        const oldPath = path.join(path.resolve(__dirname, ".."), req.file.path);
        fs.renameSync(oldPath, newPath);
    }

    // Creating new messageData
    const newMessageData = await MessageData.create({
        userId: req.user.id,
        image: uniqueFilename,
        message: (req.body.message != undefined ? req.body.message : null),
        score: 0,
        scoreCount: 0,
        viewCount: 0,
        replyCount: 0,
        forwardCount: 0,
        commentCount: 0,
        isRepliable: true,
        isForwardable: true,
        isCommentable: false,
        isScorable: false,
        isViewable: false,
        isRedirectable: false
    });

    const newReply = await Reply.create({
        messageDataId: req.body.messageDataId,
        replyMessageDataId: newMessageData.id,
        userId: req.user.id,
    });

    await ChatData.create({
        chatId: req.body.chatId,
        chatType: req.body.chatType,
        messageId: newReply.id,
        messageType: "reply"
    });

    const messageData = await MessageData.findOne({
        where: {
            id: req.body.messageDataId
        }
    });

    await MessageData.update(
        {
            replyCount: messageData.replyCount + 1
        },
        {
            where: {
                id: messageData.id
            }
        }
    );

    if (req.body.chatType == "rumor") {
        const rumorChat = await RumorChat.findOne({
            where: { 
                id: req.body.chatId
            }
        });

        const userChat = await UserChat.findOne({
            where: { 
                userId: req.user.id,
                chatId: rumorChat.id,
                chatType: "rumor"
            }
        });

        if (userChat == null) {
            await UserChat.create({
                userId: req.user.id,
                chatId: rumorChat.id,
                chatType: "rumor",
                lastViewedMessageId: newReply.id,
                currentScrollMessageId: newReply.id
            });
        }

        await Comment.create({
            userId: req.user.id,
            messageDataId: rumorChat.messageDataId,
            messageId: newReply.id,
            messageType: "reply"
        });

        const messageData = await MessageData.findOne({
            where: {
                id: rumorChat.messageDataId
            }
        });

        await MessageData.update(
            {
                commentCount: messageData.commentCount + 1
            },
            {
                where: {
                    id: messageData.id
                }
            }
        );
    }

    res.status(200).json({
        message: "New reply created successfully!",
        status: "ok"
    });
}));

router.post("/forward", auth, validate(validateForwardData), asyncMiddleware(async (req, res) => {

    const newForward = await Forward.create({
        messageDataId: req.body.messageDataId,
        userId: req.user.id,
    });

    await ChatData.create({
        chatId: req.body.chatId,
        chatType: req.body.chatType,
        messageId: newForward.id,
        messageType: "forward"
    });

    const messageData = await MessageData.findOne({
        where: {
            id: req.body.messageDataId
        }
    });

    await MessageData.update(
        {
            forwardCount: messageData.forwardCount + 1
        },
        {
            where: {
                id: messageData.id
            }
        }
    );

    if (req.body.chatType == "rumor") {
        const rumorChat = await RumorChat.findOne({
            where: { 
                id: req.body.chatId
            }
        });

        const userChat = await UserChat.findOne({
            where: { 
                userId: req.user.id,
                chatId: rumorChat.id
            }
        });

        if (userChat == null) {
            await UserChat.create({
                userId: req.user.id,
                chatId: rumorChat.id,
                chatType: "rumor",
                lastViewedMessageId: newForward.id,
                currentScrollMessageId: newForward.id
            });
        }

        await Comment.create({
            userId: req.user.id,
            messageDataId: rumorChat.messageDataId,
            messageId: newForward.id,
            messageType: "forward"
        });

        const messageData = await MessageData.findOne({
            where: {
                id: rumorChat.messageDataId
            }
        });

        await MessageData.update(
            {
                commentCount: messageData.commentCount + 1
            },
            {
                where: {
                    id: messageData.id
                }
            }
        );
    }

    res.status(200).json({
        message: "New forward created successfully!",
        status: "ok"
    });
}));

router.post("/score", auth, validate(validateScoreData), asyncMiddleware(async (req, res) => {

    const score  = await Score.findOne({
        where: {
            userId: req.user.id,
            messageDataId: req.body.messageDataId
        }
    });

    const messageData = await MessageData.findOne({
        where: {
            id: req.body.messageDataId
        }
    });

    const rumorChat = await RumorChat.findOne({
        where: {
            messageDataId: messageData.id
        }
    });

    if (rumorChat != null) {
        const userChat = await UserChat.findOne({
            where: {
                userId: req.user.id,
                chatId: rumorChat.id,
                chatType: "rumor"
            }
        });

        if (userChat == null) {
            const lastChatData = ChatData.findOne({
                where: { 
                    chatId: rumorChat.id
                },
                order: [ [ 'createdAt', 'DESC' ] ],
            });

            await UserChat.create({
                userId: req.user.id,
                chatId: rumorChat.id,
                chatType: "rumor",
                lastViewedMessageId: lastChatData.id,
                currentScrollMessageId: lastChatData.id
            });
        }
    }

    if (score == null) {
        await Score.create({
            userId: req.user.id,
            messageDataId: req.body.messageDataId,
            score: req.body.score
        });

        await MessageData.update(
            {
                scoreCount: messageData.scoreCount + 1,
                score: (messageData.score * messageData.scoreCount + req.body.score) / (messageData.scoreCount + 1)
            },
            {
                where: {
                    id: messageData.id
                }
            }
        );

        res.status(200).json({
            message: "Score added successfully!",
            status: "ok"
        });
    } else {
        if (score.score == req.body.score) {
            await MessageData.update(
                {
                    scoreCount: messageData.scoreCount - 1,
                    score: (messageData.scoreCount == 1) ? 0 : (messageData.score * messageData.scoreCount - score.score) / (messageData.scoreCount - 1)
                },
                {
                    where: {
                        id: messageData.id
                    }
                }
            );
    
            await Score.destroy({
                where: {
                    userId: req.user.id,
                    messageDataId: req.body.messageDataId
                },
            });
    
            res.status(200).json({
                message: "Score removed successfully!",
                status: "ok"
            });
        } else {
            await Score.update(
                {
                    score: req.body.score
                },
                {
                    where: {
                        userId: req.user.id,
                        messageDataId: req.body.messageDataId,
                    }
                }
            );
    
            await MessageData.update(
                {
                    score: (messageData.score * messageData.scoreCount + req.body.score - score.score) / messageData.scoreCount
                },
                {
                    where: {
                        id: messageData.id
                    }
                }
            );
    
            res.status(200).json({
                message: "Score updated successfully!",
                status: "ok"
            });
        }
    }
}));

router.post("/scored", auth, validate(validateIdData), asyncMiddleware(async (req, res) => {

    const score = await Score.findOne({
        where: {
            userId: req.user.id,
            messageDataId: req.body.id
        }
    });

    if (score == null)
        return res.status(400).json({ message: "User doesn't have score on this message!", status: "not_scored"});

    res.status(200).json({
        data: score,
        message: "Score retrieved successfully!",
        status: "ok"
    });
}));

router.post("/view", auth, validate(validateViewData), asyncMiddleware(async (req, res) => {

    const view  = await View.findOne({
        where: {
            userId: req.user.id,
            messageDataId: req.body.messageDataId
        }
    });

    const messageData = await MessageData.findOne({
        where: {
            id: req.body.messageDataId
        }
    });

    if (view == null) {
        await View.create({
            userId: req.user.id,
            messageDataId: req.body.messageDataId
        });

        await MessageData.update(
            {
                viewCount: messageData.viewCount + 1
            },
            {
                where: {
                    id: messageData.id
                }
            }
        );

        return res.status(200).json({
            message: "View added successfully!",
            status: "ok"
        });
    }

    res.status(200).json({
        message: "This message is already viewed!",
        status: "ok"
    });
}));

router.post("/rumor", auth, multer({ dest: "resources/image" }).single("image"), validate(validateRumorData), asyncMiddleware(async (req, res) => {
    
    // Fixing the image extension
    let uniqueFilename = null;
    if (req.file) {
        const originalName = req.file.originalname;
        const fileExtension = path.extname(originalName);
        uniqueFilename = `${req.file.filename}${fileExtension}`;
        const newPath = path.join(path.resolve(__dirname, ".."), 'resources/image', uniqueFilename);
        const oldPath = path.join(path.resolve(__dirname, ".."), req.file.path);
        fs.renameSync(oldPath, newPath);
    }

    // Creating new messageData
    const newMessageData = await MessageData.create({
        userId: req.user.id,
        image: uniqueFilename,
        message: (req.body.message != undefined ? req.body.message : null),
        score: 0,
        scoreCount: 0,
        viewCount: 0,
        replyCount: 0,
        forwardCount: 0,
        commentCount: 0,
        isRepliable: true,
        isForwardable: true,
        isCommentable: true,
        isScorable: true,
        isViewable: true,
        isRedirectable: true
    });

    const newMessage = await Message.create({
        messageDataId: newMessageData.id,
        userId: req.user.id,
    });

    const newRumorChat = await RumorChat.create({
        messageDataId: newMessageData.id
    });

    const newChat = await UserChat.create({
        userId: req.user.id,
        chatId: newRumorChat.id,
        chatType: "rumor",
        lastViewedMessageId: newMessage.id,
        currentScrollMessageId: newMessage.id
    });

    await ChatData.create({
        chatId: newChat.chatId,
        chatType: newChat.chatType,
        messageId: newMessage.id,
        messageType: "message"
    });

    res.status(200).json({
        message: "New rumor and rumor chat created successfully!",
        status: "ok"
    });
}));

router.post("/initial-message", auth, multer({ dest: "resources/image" }).single("image"), validate(validateInitialMessageData), asyncMiddleware(async (req, res) => {
    
    // Fixing the image extension
    let uniqueFilename = null;
    if (req.file) {
        const originalName = req.file.originalname;
        const fileExtension = path.extname(originalName);
        uniqueFilename = `${req.file.filename}${fileExtension}`;
        const newPath = path.join(path.resolve(__dirname, ".."), 'resources/image', uniqueFilename);
        const oldPath = path.join(path.resolve(__dirname, ".."), req.file.path);
        fs.renameSync(oldPath, newPath);
    }

    const contactChat = await ContactChat.findOne({
        where: {
            [Op.or]: [
              { userId1: { [Op.eq]: req.user.id } },
              { userId2: { [Op.eq]: req.user.id } }
            ]
        }
    });

    if (contactChat != null)
        return res.status(400).json({message: "Chat already exists!", status: "chat_exists"});

    // Creating new messageData
    const newMessageData = await MessageData.create({
        userId: req.user.id,
        image: uniqueFilename,
        message: (req.body.message != undefined ? req.body.message : null),
        score: 0,
        scoreCount: 0,
        viewCount: 0,
        replyCount: 0,
        forwardCount: 0,
        commentCount: 0,
        isRepliable: true,
        isForwardable: true,
        isCommentable: false,
        isScorable: false,
        isViewable: false,
        isRedirectable: false
    });

    const newMessage = await Message.create({
        messageDataId: newMessageData.id,
        userId: req.user.id,
    });

    const newContactChat = await ContactChat.create({
        userId1: req.user.id,
        userId2: req.body.toUserId
    });

    const newChat = await UserChat.create({
        userId: req.user.id,
        chatId: newContactChat.id,
        chatType: "contact",
        lastViewedMessageId: newMessage.id,
        currentScrollMessageId: newMessage.id
    });

    const newChat2 = await UserChat.create({
        userId: req.body.toUserId,
        chatId: newContactChat.id,
        chatType: "contact",
        lastViewedMessageId: newMessage.id,
        currentScrollMessageId: newMessage.id
    });

    await ChatData.create({
        chatId: newChat.chatId,
        chatType: newChat.chatType,
        messageId: newMessage.id,
        messageType: "message"
    });

    res.status(200).json({
        message: "New message and contact chat created successfully!",
        status: "ok"
    });
}));

router.post("/edit", auth, validate(validateUserEditData), asyncMiddleware(async (req, res) => {

    await User.update({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        identifier: req.body.identifier
    },{
        where: {
            id: req.user.id
        }
    });

    res.status(200).json({
        message: "User data updated successfully!",
        status: "ok"
    });
}));

router.post("/upload-profile-pic", auth, multer({ dest: "resources/profile_pic" }).single("image"), asyncMiddleware(async (req, res) => {
    if (!req.file) {
        return res.state(400).json({
            message: "No file uploaded!",
            status: "upload_fail"
        })
    }

    // Finding the user according to id stored in jwt
    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    // Deleting the previous image
    if (user.profilePic != null)
        fs.unlinkSync(path.join(path.resolve(__dirname, ".."), "resources/profile_pic", user.profilePic));

    // Fixing the image extension
    const originalName = req.file.originalname;
    const fileExtension = path.extname(originalName);
    const uniqueFilename = `${req.file.filename}${fileExtension}`;
    const newPath = path.join(path.resolve(__dirname, ".."), 'resources/profile_pic', uniqueFilename);
    const oldPath = path.join(path.resolve(__dirname, ".."), req.file.path);
    fs.renameSync(oldPath, newPath);

    // Updating profilePic address
    try {
        await User.update(
            {
                profilePic: uniqueFilename
            },
            {
                where: { id: user.id }
            }
        );
    } catch (ex) {
        return res.status(400).json({ status: "database_error", message: ex.errors[0].message });
    }

    res.status(200).json({
        message: "Profile picture uploaded successfully!",
        status: "ok"
    });
}));

router.post("/profile-pic", auth, asyncMiddleware(async (req, res) => {
    // Finding the user according to id stored in jwt
    const user = await User.findOne({
        where: {
            id: req.user.id
        }
    });

    if (user.profilePic == null)
        return res.status(400).json({ status: "missing_profile_pic", message: "There is no profile picture for this user!" });

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/profile_pic", user.profilePic));
}));



module.exports = router;