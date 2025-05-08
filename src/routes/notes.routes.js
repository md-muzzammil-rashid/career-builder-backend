import { Router } from 'express';
import { createNote, getNotes, getNoteById } from '../controllers/notes.controllers.js'; // Adjust the path according to your project structure

const router = Router();

router.post('/', createNote);
router.get('/', getNotes);
router.get('/:id', getNoteById);

export default router;