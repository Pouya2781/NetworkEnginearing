const _ = require("lodash");
const auth = require("../middleware/auth");
const validate = require("../middleware/validate");
const asyncMiddleware = require("../middleware/async");
const { Score, User, MessageData, UserChat, ContactChat, RumorChat, ChatData, Message, Reply, Forward, sequelize, Sequelize } = require("../models");
const { validateIdData, validateSearchData, validateLoadData } = require("../validators/chat");
const path = require("path");
const fs = require("fs");
const express = require("express");
const { DATE } = require('sequelize');
const router = express.Router();

router.post("/load-all", auth, validate(validateIdData), asyncMiddleware(async (req, res) => {
    
    const userChatContact = await UserChat.findAll({
        include: [
            {
                model: ContactChat,
                include: [
                    {
                        model: User,
                        as: "user1"
                    },
                    {
                        model: User,
                        as: "user2"
                    }
                ]
            }
        ],
        where: {
            userId: req.body.id,
            chatType: "contact"
        }
    });

    for (let i = 0; i < userChatContact.length; i++) {
        const latestChatData = (await ChatData.findAll({
            where: {
                chatId: userChatContact[i].chatId,
                chatType: 'contact'
            },
            order: [ ['createdAt', 'DESC'] ],
        }))[0];

        let latestMessage = null;
        if (latestChatData.messageType == "message") {
            latestMessage = await Message.findOne({
                include: [
                    {
                        model: ChatData,
                        where: {
                            messageType: "message"
                        }
                    },
                    {
                        model: User
                    },
                    {
                        model: MessageData,
                        include: [User]
                    }
                ],
                where: {
                    id: latestChatData.messageId
                }
            })
        } else if (latestChatData.messageType == "reply") {
            latestMessage = await Reply.findOne({
                include: [
                    {
                        model: ChatData,
                        where: {
                            messageType: "reply"
                        }
                    },
                    {
                        model: User
                    },
                    {
                        model: MessageData,
                        as: 'messageData',
                        include: [User]
                    },
                    {
                        model: MessageData,
                        as: 'replyMessageData',
                        include: [User]
                    }
                ],
                where: {
                    id: latestChatData.messageId
                }
            })
        } else if (latestChatData.messageType == "forward") {
            latestMessage = await Forward.findOne({
                include: [
                    {
                        model: ChatData,
                        where: {
                            messageType: "forward"
                        }
                    },
                    {
                        model: User
                    },
                    {
                        model: MessageData,
                        include: [User]
                    }
                ],
                where: {
                    id: latestChatData.messageId
                }
            })
        }
        userChatContact[i].setDataValue('latestMessage', latestMessage)
    }

    const userChatRumor = await UserChat.findAll({
        include: [
            {
                model: RumorChat,
                include: [
                    {
                        model: MessageData,
                        include: [
                            {
                                model: User
                            }
                        ]
                    },
                ]
            }
        ],
        where: {
            userId: req.body.id,
            chatType: "rumor"
        }
    });
    
    res.status(200).json({
        data: {
            contacts: userChatContact,
            rumors: userChatRumor
        },
        message: "Chat info retrieved successfully!",
        status: "ok"
    });
}));

router.post("/load", auth, validate(validateLoadData), asyncMiddleware(async (req, res) => {
    
    const userChat = await UserChat.findOne({
        where: {
            userId: req.user.id,
            chatId: req.body.chatId,
            chatType: req.body.chatType
        }
    });

    let userChatData = null;
    if (req.body.chatType == "contact") {
        userChatData = await ContactChat.findOne({
            include: [
                {
                    model: User,
                    as: "user1"
                },
                {
                    model: User,
                    as: "user2"
                }
            ],
            where: {
                id: req.body.chatId,
            }
        });
    } else {
        userChatData = await RumorChat.findOne({
            include: [
                {
                    model: MessageData,
                    include: [User]
                }
            ],
            where: {
                id: req.body.chatId,
            }
        });
    }

    const messages = await Message.findAll({
        include: [
            {
                model: ChatData,
                where: {
                    chatId: req.body.chatId,
                    chatType: req.body.chatType,
                    messageType: "message"
                }
            },
            {
                model: User
            },
            {
                model: MessageData,
                include: [User]
            }
        ]
    });

    const replies = await Reply.findAll({
        include: [
            {
                model: ChatData,
                where: {
                    chatId: req.body.chatId,
                    chatType: req.body.chatType,
                    messageType: "reply"
                }
            },
            {
                model: User
            },
            {
                model: MessageData,
                as: 'messageData',
                include: [User]
            },
            {
                model: MessageData,
                as: 'replyMessageData',
                include: [User]
            }
        ]
    });

    const forwards = await Forward.findAll({
        include: [
            {
                model: ChatData,
                where: {
                    chatId: req.body.chatId,
                    chatType: req.body.chatType,
                    messageType: "forward"
                }
            },
            {
                model: User
            },
            {
                model: MessageData,
                include: [User]
            }
        ]
    });

    const sortedMessages = [messages, replies, forwards].flat().sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

    
    res.status(200).json({
        data: {
            chatData: userChatData,
            userChatData: userChat,
            messages: sortedMessages,
        },
        message: "Chat info retrieved successfully!",
        status: "ok"
    });
}));

router.post("/message/image", auth, validate(validateIdData), asyncMiddleware(async (req, res) => {

    // await sleep(1000);

    const messageData = await MessageData.findOne({
        where: {
            id: req.body.id
        }
    });

    if (messageData.image == null)
        return res.status(400).json({ status: "missing_image", message: "There is no image for this message!" });

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/image", messageData.image));
}));

router.post("/message/rumor-chat", auth, validate(validateIdData), asyncMiddleware(async (req, res) => {

    const rumorChat = await RumorChat.findOne({
        where: {
            messageDataId: req.body.id
        }
    })

    if (rumorChat == null)
        return res.status(400).json({ message: "Rumor chat not found!", status: "rumor_chat_not_found"});
    
    res.status(200).json({
        data: rumorChat,
        message: "Message scores retrieved successfully!",
        status: "ok"
    });
}));

router.post("/message/scores", auth, validate(validateIdData), asyncMiddleware(async (req, res) => {

    const scores = await Score.findAll({
        where: {
            messageDataId: req.body.id
        }
    })
    
    res.status(200).json({
        data: scores,
        message: "Message scores retrieved successfully!",
        status: "ok"
    });
}));

router.post("/user/info", auth, validate(validateIdData), asyncMiddleware(async (req, res) => {
    
    const user = await User.findOne({
        where: {
            id: req.body.id
        }
    });

    res.status(200).json({
        data: user,
        message: "User info retrieved successfully!",
        status: "ok"
    });
}));

router.post("/user/profile-pic", auth, validate(validateIdData), asyncMiddleware(async (req, res) => {

    const user = await User.findOne({
        where: {
            id: req.body.id
        }
    });

    if (user.profilePic == null)
        return res.status(400).json({ status: "missing_profile_pic", message: "There is no profile picture for this user!" });

    res.status(200).sendFile(path.join(path.resolve(__dirname, ".."), "resources/profile_pic", user.profilePic));
}));

router.post("/user/search", auth, validate(validateSearchData), asyncMiddleware(async (req, res) => {
    
    await sleep(800);

    const user = await User.findOne({
        where: {
            identifier: req.body.identifier
        }
    });

    if (user == null)
        return res.status(400).json({ status: "user_not_found", message: "There is no user with this identifier!" });

    res.status(200).json({
        data: user,
        message: "User info retrieved successfully!",
        status: "ok"
    });
}));

async function sleep(miliseconds) {
    return new Promise((resolve) => setTimeout(resolve, miliseconds));
}

module.exports = router;