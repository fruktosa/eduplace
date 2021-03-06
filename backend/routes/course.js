const router = require("express").Router();
const path = require("path");
const multer = require("multer");
const File = require("../models/file.model");
let Course = require("../models/course.model");

// get all course
router.route("/").get((req, res) => {
  Course.find()
    .then((courses) => res.json(courses))
    .catch((error) => res.status(400).json("Error: " + error));
});

// add new course
router.route("/add").post((req, res) => {
  const title = req.body.title;
  const description = req.body.description;
  const category = req.body.category;
  const rating = req.body.rating;
  const document = req.body.document;
  const posterUrl = req.body.posterUrl;
  const price = req.body.price;

  const newCourse = new Course({
    title,
    description,
    category,
    rating,
    document,
    posterUrl,
    price,
  });

  newCourse
    .save()
    .then(() => res.json("Course added!"))
    .catch((error) => res.status(400).json("Error: " + error));
});

// update course
router.route("/update/:id").post((req, res) => {
  Course.findById(req.params.id).then((course) => {
    course.title = req.body.title;
    course.description = req.body.description;
    course.category = req.body.category;
    course.rating = req.body.rating;
    course.document = req.body.documentUrl;
    course.posterUrl = req.body.posterUrl;
    course.price = req.body.price;

    course
      .save()
      .then(() => res.json("Course updated!"))
      .catch((error) => res.status(400).json("Error: " + error));
  });
});

// delete course
router.route("/delete/:id").delete((req, res) => {
  Course.findByIdAndDelete(req.params.id)
    .then(() => res.json("Course deleted!"))
    .catch((error) => res.status(400).json("Error: " + error));
});

// upload
const storage = multer.diskStorage({
  destination: "./public/doc",
  filename: function (req, file, callback) {
    callback(null, "DOC-" + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myfile");

router.route("/upload/document").post((req, res) => {
  upload(req, res, () => {
    console.log(req);
    console.log("Request file ---", req.file);
    const file = new File();
    file.meta_data = req.file;
    file
      .save()
      .then((status) => {
        res.json(status.meta_data);
      })
      .catch((error) => res.status(400).json("Error: " + error));
  });
});

module.exports = router;
