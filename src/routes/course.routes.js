import express from 'express';
import { createCourse, getModuleByCourseIdAndModuleNo, getAllCourses, youTubePlaylistToCourse } from '../controllers/course.controllers.js';
const router = express.Router();

router.get('/', getAllCourses);
router.post('/', createCourse);
router.post('/youtube-create', youTubePlaylistToCourse);
router.get('/:id/:moduleNo', getModuleByCourseIdAndModuleNo); // New route for fetching specific module

export default router;