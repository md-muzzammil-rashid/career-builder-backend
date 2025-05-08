import { cloudUpload } from '../middlewares/multer.middleware.js';
import { Notes } from '../models/notes.model.js'; // Adjust the path according to your project structure
import { uploadOnCloudinary } from '../utils/Cloudinary.js';
// import { getImage } from '../utils/getImage.service';
import genAi from "../utils/gemini.service.js";

export const createNote = async (req, res) => {
    try {
        const { title, topics, subject, language } = req.body;

        // Basic validation
        if (!title || !topics || !subject || !language) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Generate AI notes and get the PDF buffer
        const pdfBuffer = await genAi.genAiNotes(title, topics, subject, language);

        // Send the PDF as a response with appropriate headers for auto-download
        const upload = await genAi.uploadToDropbox(pdfBuffer, title)
        console.log(upload)
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${title}_Notes.pdf"`,
            'Content-Length': pdfBuffer.byteLength.toString() // Set Content-Length
        });

        res.send(Buffer.from(pdfBuffer)); // Ensure buffer is converted to Node.js Buffer

    } catch (error) {
        // Log the error and send an error response
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'An error occurred while generating the PDF' });
    }
};



// Read all notes
export const getNotes = async (req, res) => {
    try {
        const notes = await Notes.find().populate('user');
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Read a single note by ID
export const getNoteById = async (req, res) => {
    try {
        const note = await Notes.findById(req.params.id).populate('user');
        if (!note) {
            return res.status(404).json({ message: 'Note not found' });
        }
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default {
    createNote,
    getNoteById,
    getNotes
};