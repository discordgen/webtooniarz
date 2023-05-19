import { claszior } from "./rsa.js"
import express from 'express';

const app = express();

app.listen(2137, () => {
    console.log("oowah");
})
app.use(express.json())
app.post("/calc", (req, res) => {
    claszior._onloadRsaKey(
        req.body
    )
   res.send(claszior.encrypt(req.body["user"], req.body["pass"]))
});