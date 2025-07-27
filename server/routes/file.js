const router = require('express').Router();
const multer = require('multer');
const xlsx = require('xlsx');

// Set up multer for in-memory file storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// This route handles the file upload. The 'upload.single('excelFile')' part
// tells multer to expect one file, sent with the field name 'excelFile'.
router.post('/upload', upload.single('excelFile'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' });
        }

        // req.file.buffer contains the file data in memory
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        // Get the first sheet name
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert the sheet to JSON
        const jsonData = xlsx.utils.sheet_to_json(worksheet);

        res.status(200).json({ 
            message: 'File parsed successfully!', 
            data: jsonData 
        });

    } catch (error) {
        console.error("Error parsing file:", error);
        res.status(500).json({ message: 'Error parsing Excel file.' });
    }
});

module.exports = router;