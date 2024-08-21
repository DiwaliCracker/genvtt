const express = require('express');
const app = express();

// Serve VTT dynamically
app.get('/', (req, res) => {
    const imgUrl = req.query.img1;
    const width = parseInt(req.query.w, 10);
    const height = parseInt(req.query.h, 10);
    const interval = parseInt(req.query.interval, 10);
    const rows = parseInt(req.query.r, 10);
    const cols = parseInt(req.query.c, 10);

    if (imgUrl && width && height && interval && rows && cols) {
        let vttData = 'WEBVTT\n\n';
        let currentTime = 0;

        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const startTime = new Date(currentTime * 1000).toISOString().substr(11, 8) + '.000';
                const endTime = new Date((currentTime + interval) * 1000).toISOString().substr(11, 8) + '.000';
                const position = `#xywh=${x * width},${y * height},${width},${height}`;
                vttData += `${startTime} --> ${endTime}\n${imgUrl}${position}\n\n`;
                currentTime += interval;
            }
        }

        res.setHeader('Content-Type', 'text/vtt');
        res.send(vttData);
    } else {
        res.status(400).send('Missing parameters');
    }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
