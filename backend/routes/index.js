const express = require('express');
const userRouter = require("./user");
require('dotenv').config();

const router = express.Router();

router.use("/user", userRouter);


module.exports = router;