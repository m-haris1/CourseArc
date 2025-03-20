const Category = require("../models/Category")

function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body
    if (!name) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" })
    }
    const CategorysDetails = await Category.create({
      name: name,
      description: description,
    })
    console.log(CategorysDetails)
    return res.status(200).json({
      success: true,
      message: "Categorys Created Successfully",
    })
  } catch (error) {
    return res.status(500).json({
      success: true,
      message: error.message,
    })
  }
}

exports.showAllCategories = async (req, res) => {
  try {
    const allCategorys = await Category.find()
    res.status(200).json({
      success: true,
      data: allCategorys,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

// exports.categoryPageDetails = async (req, res) => {
//   try {
//     const { categoryId } = req.body
    

//     // Get courses for the specified category
//     const selectedCategory = await Category.findById(categoryId)
//       .populate({
//         path: "courses",
//         match: { status: "Published" },
//         populate: "ratingAndReviews",
//       })
//       .exec()

//     console.log("SELECTED COURSE", selectedCategory)
//     // Handle the case when the category is not found
//     if (!selectedCategory) {
//       console.log("Category not found.")
//       return res
//         .status(404)
//         .json({ success: false, message: "Category not found" })
//     }
//     // Handle the case when there are no courses
//     if (selectedCategory.courses.length === 0) {
//       console.log("No courses found for the selected category.")
//       return res.status(404).json({
//         success: false,
//         message: "No courses found for the selected category.",
//       })
//     }

//     // Get courses for other categories
//     const categoriesExceptSelected = await Category.find({
//       _id: { $ne: categoryId },
//     });
//     console.log("categoriesExceptSelected is : " ,categoriesExceptSelected)
//     // Make sure getRandomInt function is defined
//     const randomCategory = categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)];

//     if (!randomCategory) {
//       throw new Error("Random category is invalid ");
//     }
//     if( !randomCategory._id){
//       throw new Error("missing _id.");
//     }
//     let differentCategory = await Category.findOne({ _id: randomCategory?._id })
//       .populate({
//         path: "courses",
//         match: { status: "Published" },
//       })
//       .exec();
//       console.log("This is my category Id ",categoryId)
//     console.log("categoriesExceptSelected is : " ,categoriesExceptSelected)
//     // Get top-selling courses across all categories
//     const allCategories = await Category.find()
//       .populate({
//         path: "courses",
//         match: { status: "Published" },
//       })
//       .exec()
//     const allCourses = allCategories.flatMap((category) => category.courses)
//     const mostSellingCourses = allCourses
//       .sort((a, b) => b.sold - a.sold)
//       .slice(0, 10)

//     res.status(200).json({
//       success: true,
//       data: {
//         selectedCategory,
//         differentCategory,
//         mostSellingCourses,
//       },
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: "Internal server error",
//       error: error.message,
//     })
//   }
// }
exports.categoryPageDetails = async (req, res) => { 
  try {
    const { categoryId } = req.body;
  // Fetch categories except the selected one
  const categoriesExceptSelected = await Category.find({
    _id: { $ne: categoryId },
  });

  let differentCategory = [];

  if (categoriesExceptSelected.length > 0) {
    const randomCategory = categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)];

    if (randomCategory && randomCategory._id) {
      
      differentCategory = await Category.findOne({ _id: randomCategory._id })
        .populate({
          path: "courses",
          match: { status: "Published" },
        })
        .exec();
    }
  }

  
  const selectedCategory = await Category.findById(categoryId)
    .populate({
      path: "courses",
      match: { status: "Published" },
    })
    .exec();

  

  // Get top-selling courses across all categories
  const allCategories = await Category.find()
    .populate({
      path: "courses",
      match: { status: "Published" },
    })
    .exec();

  const allCourses = allCategories.flatMap((category) => category.courses);
  const mostSellingCourses = allCourses
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 10); // Get the top 10 most-selling courses

  // Return the response
  res.status(200).json({
    success: true,
    data: {
      selectedCategory, // The selected category (categoryId)
      differentCategory, // A random category or an empty array if not found
      mostSellingCourses, // The top-selling courses across all categories
    },
  });
} catch (error) {
  // Handle any errors gracefully
  console.error("Error: ", error); // Log the error for debugging

  // Return an error response
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: error.message,
  });
}
}
