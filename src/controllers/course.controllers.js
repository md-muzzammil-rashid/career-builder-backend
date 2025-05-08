import { Course as CourseModel } from "../models/course.model.js";
import genAi from "../utils/gemini.service.js";
import { getImage } from "../utils/getImage.service.js";
import { fetchYouTubeVideos, fetchYouTubePlaylistDetails } from "../utils/youtube.service.js";
import { parseCourseFromString } from "../utils/parseJson.service.js";

const apiKey = process.env.YOUTUBE_API_KEY1;

const createCourse = async (
  req,
  res,
  next
) => {
  const { title, topics, subject, language } = req.body;
  // const apiKey = process.env.YOUTUBE_API_KEY2!;
  // const apiKey = process.env.YOUTUBE_API_KEY3!;
  // const apiKey = process.env.YOUTUBE_API_KEY!;
  try {
    const image = await getImage(title);
    const genAiResponse = await genAi.genAi(title, topics, subject, language);
    const courseDetails = genAiResponse.message;
    let course = parseCourseFromString(courseDetails);
    course.image = image;

    for (let module of course.modules) {
      const videoUrl = await fetchYouTubeVideos(module.videoQuery, apiKey);
      module.video = videoUrl;
    }

    const newCourse = new CourseModel(course);
    await newCourse.save();
    res.status(201).send(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
};

const getModuleByCourseIdAndModuleNo = async (
  req,
  res,
  next
) => {
  const { id, moduleNo } = req.params;

  try {
    const course = await CourseModel.findById(id);
    if (!course) {
      throw new ApiError(404, "Course not found");
    }

    const moduleIndex = parseInt(moduleNo);
    if (
      isNaN(moduleIndex) ||
      moduleIndex < 0 ||
      moduleIndex >= course.modules.length
    ) {
      throw new ApiError(404, "Module not found");
    }

    const module = course.modules[moduleIndex];

    res.status(200).json({ course, module });
  } catch (error) {
    console.error(`Error fetching module: ${error.message}`);
    res
      .status(error instanceof ApiError ? error.statusCode : 500)
      .send({ message: error.message });
  }
};

const getAllCourses = async (req, res, next) => {
  const { search } = req.query;
  let filter = {};
  if (search) {
    const regex = new RegExp(search, "i");
    filter = {
      $or: [
        { title: { $regex: regex } },
        { subject: { $regex: regex } },
        { description: { $regex: regex } }
      ]
    };
  }

  try {
    const courses = await CourseModel.find(
      filter,
      "title subject modules description image instructor duration"
    ).lean();

    const courseData = courses.map((course) => ({
      title: course.title,
      subject: course.subject,
      modules: course.modules.length,
      description:
        course.modules.length > 0
          ? course.modules[0].description.length > 100
            ? course.modules[0].description.substring(0, 100) + "..."
            : course.modules[0].description
          : "",
      image: course.image || "",
      route: `/course/${course._id}/0`,
    }));

    res.status(200).json(courseData);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
};

const youTubePlaylistToCourse = async (req, res) => {
  const { title, playlistId, subject } = req.body;
  const apiKey = process.env.YOUTUBE_API_KEY1;

  try {
    const image = await getImage(title);
    const playlistDetails = await fetchYouTubePlaylistDetails(playlistId, apiKey);

    const modules = playlistDetails.map((video, index) => ({
      title: `Module ${index + 1}: ${video.title}`,
      description: video.description,
      video: video.videoUrl,
    }));

    const newCourse = new CourseModel({
      title,
      topics: playlistDetails.map(video => video.title),
      subject,
      language: "English",
      image,
      modules
    });

    await newCourse.save();
    res.status(201).send(newCourse);
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ error: error.message });
  }
};

export { createCourse, getModuleByCourseIdAndModuleNo, getAllCourses, youTubePlaylistToCourse };