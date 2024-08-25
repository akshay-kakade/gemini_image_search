const PORT = 8000
const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
const fs = require('fs')
const multer = require('multer')
const { GoogleGenerativeAI } = require("@google/generative-ai")

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public')
    },
    filename:  (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname)
    }, 
})

const upload = multer({ storage:storage }).single('file')
let filePath

app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
        return res.send(500).json(err)

        }
        filePath = req.file.path
    })
})
app.post('/gemini', async (req, res) => {
    try {
        function fileToGenerativePath(path, mimeType) {
            return {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                    mimeType
                }
            }
        }

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest"})
        const prompt = req.body.message
        const result = await model.generateContent([prompt, fileToGenerativePath(filePath, "image/jpeg")])
        const response = await result.response
        const text = response.text()
        res.send(text)
    } catch (err) {
        console.log(err)
    }
})


app.listen(PORT, () => console.log("Listening to change on PORT" + PORT))