import mongoose from "mongoose";

// ✅ Define Course Schema
const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: String, // e.g. "8 Weeks"
      required: true,
    },
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      required: true,
    },
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    material: {
      type: String,
      default: null,
    },
    rating: {
      type: Number,
      default: 0,
    },
    schedule: {
      type: String,
      default: null,
    },
    completionRate: {
      type: Number,
      default: null,
    },
    skills: {
      type: [mongoose.Schema.Types.Mixed],
      default: null,
    },
    learningOutcomes: {
      type: [mongoose.Schema.Types.Mixed],
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["draft", "pending", "approved", "published"],
      required: true,
      default: "published",
    },
    createdByRole: {
      type: String,
      enum: ["admin", "instructor"],
      required: true,
      default: "admin",
    },
    type: {
      type: String,
      enum: ["live", "recorded"],
      required: true,
      default: "live",
    },
  },
  {
    timestamps: true,
    collection: "Course", // matches freezeTableName behavior
  }
);

const Course = mongoose.model("Course", courseSchema);
export default Course;

// ✅ CRUD Operations

export const createCourse = async (courseData) => {
  try {
    return await Course.create(courseData);
  } catch (error) {
    console.error("❌ Error creating course:", error);
    throw new Error("Failed to create course");
  }
};

export const getCourseById = async (id) => {
  try {
    const course = await Course.findById(id);
    if (!course) throw new Error("Course not found");
    return course;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getCourses = async (filters = {}, limit = 10, offset = 0) => {
  try {
    return await Course.find(filters)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit);
  } catch (error) {
    throw new Error("❌ Failed to fetch courses");
  }
};

export const updateCourse = async (id, courseData) => {
  try {
    const course = await Course.findByIdAndUpdate(id, courseData, {
      new: true,        // return updated doc
      runValidators: true,
    });
    if (!course) throw new Error("❌ Course not found");
    return course;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteCourse = async (id) => {
  try {
    const course = await Course.findByIdAndDelete(id);
    if (!course) throw new Error("❌ Course not found");
    return true;
  } catch (error) {
    throw new Error("❌ Failed to delete course");
  }
};

// ✅ Filters

export const getCoursesByInstructorId = async (instructorId) =>
  getCourses({ instructorId });

export const getCoursesByPriceRange = async (minPrice, maxPrice) =>
  getCourses({ price: { $gte: minPrice, $lte: maxPrice } });

export const getCoursesByKeyword = async (keyword) =>
  getCourses({
    $or: [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
    ],
  });