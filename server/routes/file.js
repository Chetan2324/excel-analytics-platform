const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');

// Set up multer for in-memory file storage. This is the correct configuration.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// This is the final, working route.
// The 'upload.single('excelFile')' middleware will now work correctly.
router.post('/upload', upload.single('excelFile'), (req, res) => {
    try {
        // Check if a file was actually uploaded.
        if (!req.file) {
            console.log("Upload failed: No file was attached to the request.");
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // req.file.buffer contains the raw file data.
        // The xlsx library reads this data directly from memory.
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        // Get the data from the first sheet in the Excel file.
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the sheet data into a clean JSON array.
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        // Send a success response with the parsed data back to the frontend.
        res.status(200).json({ 
            message: 'File parsed successfully!', 
            data: jsonData 
        });

    } catch (error) {
        // If the xlsx library fails to parse the file, this will catch the error.
        console.error("CRITICAL ERROR: The server crashed while trying to parse the Excel file.", error);
        res.status(500).json({ message: 'Error parsing Excel file. The file may be corrupt or in an unsupported format.' });
    }
});

module.exports = router;
