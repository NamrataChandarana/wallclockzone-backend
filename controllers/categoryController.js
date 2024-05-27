import { catchAsyncError } from "../middleware/catchAsyncError.js";
import  Category from "../models/categoryModel.js";
// import { register } from "../models/user";


export const getCategories = catchAsyncError(async(req, res, next) => {
    const category = await Category.find();

    res.status(200).send({
      success: true,
      message: "All Categories List",
      category,
    });
})





