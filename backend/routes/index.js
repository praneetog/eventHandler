const express = require('express');
const userRouter = require("./user");
const eventRouter = require("./events");
require('dotenv').config();

const router = express.Router();

router.use("/user", userRouter);
router.use("/event", eventRouter);


module.exports = router;