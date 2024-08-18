const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const cookieParser = require('cookie-parser')
const cors = require('cors');
import dotenv  from 'dotenv';
dotenv.config();

app.use(cors({
    origin: ["http://localhost:5000"],
    methods: ["POST", "GET", "DELETE", "PUT", ""],
    credentials: true
  }));
  app.use(express.json());
  app.use(cookieParser());

import signupRouter from "./routes/auth/signup";
import verifyUserRouter from "./routes/auth/verifyUser";
import loginRouter from "./routes/auth/login";
import logoutRouter from "./routes/auth/logout";
import addProductRouter from "./routes/addProduct";
import changeEmailRouter from './routes/auth/changeEmail'
app.use("/api", signupRouter)
app.use("/api", verifyUserRouter)
app.use("/api", loginRouter)
app.use("/api", logoutRouter)
app.use("/api", addProductRouter)
app.use("/api", changeEmailRouter)


app.listen(port, () => {
    console.log("The app is running on : http://localhost:"+port)
})