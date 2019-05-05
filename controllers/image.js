const Clarifai = require("Clarifai");

const app = new Clarifai.App({
    apiKey: 'f999fcc4060e40fca878946330b0da34'
});

const handleApiCall = (req, res) => {
    app.models
        .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
        .then(data => res.json(data))
        .catch(() => res.status(400).json("Unable to call the Face recognition api!"))
}

module.exports = { handleApiCall };