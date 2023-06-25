const config = require("config");
const { sequelize } = require("./models");
const asyncMiddleware = require("./middleware/async");
const errorMiddleware = require("./middleware/error");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const _ = require("lodash");
const morgan = require("morgan");
const helmet = require("helmet");
const Joi = require("joi");
const cors = require('cors');
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const chatRouter = require("./routes/chat");
const express = require("express");
const winston = require("winston");
const app = express();

const logConfiguration = {
    'transports': [
        new winston.transports.File({
            filename: "./logs/errors.log",
            handleExceptions: true,
            handleRejections: true
        }),
    ]
};
const logger = winston.createLogger(logConfiguration);

// middleware setup
app.use(cors({
    exposedHeaders: ['x-ver-token', 'x-auth-token']
}));
app.use(morgan("tiny"));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("react/build"));
app.use(errorMiddleware);

// routers
app.use("/api/auth", authRouter);
app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);

// start server and syncing with database
const port = process.env.PORT || 3001;
app.listen(port, async () => {
    console.log(`Server is listening on port ${port}...`);
    await sequelize.authenticate();
    console.log("Database connected!");
});