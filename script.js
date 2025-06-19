const URL = "https://teachablemachine.withgoogle.com/models/wVpGWWyHI/";

let lastDetectedClass = "";
let recognizer;

async function createModel() {
    const checkpointURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    recognizer = speechCommands.create("BROWSER_FFT", undefined, checkpointURL, metadataURL);
    await recognizer.ensureModelLoaded();
    return recognizer;
}

async function init() {
    document.getElementById("status").innerText = "Loading model...";
    await createModel();

    const labels = recognizer.wordLabels();
    document.getElementById("status").innerText = "Listening...";

    recognizer.listen(result => {
        const scores = result.scores;
        const maxScoreIndex = scores.indexOf(Math.max(...scores));
        const predictedClass = labels[maxScoreIndex];

        if (scores[maxScoreIndex] > 0.75 && predictedClass !== lastDetectedClass) {
            lastDetectedClass = predictedClass;
            document.getElementById("command-display").innerText = `Command: ${predictedClass}`;
        }
    }, {
        includeSpectrogram: false,
        probabilityThreshold: 0.75,
        overlapFactor: 0.5
    });
}
