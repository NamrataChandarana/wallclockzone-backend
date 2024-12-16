import { catchAsyncError } from "../middleware/catchAsyncError.js";
import { errorHandler } from "../middleware/error.js";
import categoryModel from "../models/categoryModel.js";
import { Chat } from "../models/chatModel.js";
import { Message } from "../models/messageModel.js";
import { register } from "../models/registerUser.js";

//admin
// Get all users(admin)
export const getAllUser = catchAsyncError(async (req, res, next) => {
    const users = await register.find({role: { $ne: 'admin' }});
  
    res.status(200).json({
      success: true,
      users,
    });
});
  
//get all unapprove user --admin
export const getallnewusers = catchAsyncError(async (req, res, next) => {
  const user = await register.find({ status: "false" });

  res.json({
    success: "ture",
    user,
  });
});
  
// Get single user (admin)
export const getSingleUser = catchAsyncError(async (req, res, next) => {
    const user = await register.findById(req.params.id);
  
    if (!user) {
      return next(
        new errorHandler(`User does not exist with Id: ${req.params.id}`)
      );
    }
  
    res.status(200).json({
      success: true,
      user,
    });
});
  
// Delete User --Admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await register.findById(req.params.id);
  
    if (!user)
      return next(
        new errorHandler(`User does not exist with Id: ${req.params.id}`, 400)
    );
    
    await Chat.deleteMany({users:{ $in: [req.params.id] }});
    await Message.deleteMany({sender:{$eq: req.params.id}});
    await user.deleteOne();
  
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully",
    });
});
  
// approveUser by admin  --admin
export const updateUserStatus = catchAsyncError(async (req, res, next) => {
    const user = await register.findById(req.params.id);

    if (!user)
      return next(
        new errorHandler(`User does not exist with Id: ${req.params.id}`, 400)
      );
  
    if (user.status == false) {
      user.status = "true";
    } else {
      user.status = "false";
    }
  
    await user.save();

    if (user.status == false) {
      res.status(200).json({
        success: true,
        message: `User ${req.params.id} Disapprove!`,
      });
    } else {
      res.status(200).json({
        success: true,
        message: `User ${req.params.id} Approve!`,
      });
    }
});

//2. all approved user admin
export const getApprovedUsers = catchAsyncError(async (req, res, next) => {
    const user = await register.find({ status: "true" });

    res.json({
      success: "ture",
      user,
    });
});

// export const deleteCategory = catchAsyncError(async (req, res, next) => {
//     const { id } = req.params;

//     const response = await categoryModel.findByIdAndDelete(id);

//     if(!response){
//         return next(new errorHandler(`Category does not exist !`, 400))
//     }

//     res.status(200).send({
//       success: true,
//       message: "Categry Deleted Successfully",
//     });
// });

// export const addCategory = catchAsyncError(async(req, res, next) => {
//     const { name } = req.body;

//     if (!name) {
//       return res.status(401).send({ message: "Category Name is required" });
//     }

//     const existingCategory = await categoryModel.findOne({ name });

//     if (existingCategory) {
//       return res.status(200).send({
//         success: false,
//         message: "Category Already Exisits",
//       });
//     }

//     const category = await new categoryModel({
//       name,
//       slug: slugify(name, {
//         lower: true,                          // Convert to lowercase
//         strict: true                           // Remove special characters
//     }),
//     }).save();

//     res.status(201).send({
//       success: true,
//       message: "new category created",
//       category,
//     });
// });

// export const editCategory = catchAsyncError(async(req, res, next) => {
//   const { name } = req.body;
//   const { id } = req.params;
//   const category = await categoryModel.findByIdAndUpdate(
//     id,
//     { name, slug: slugify(name, {
//       lower: true,                      
//       strict: true,                          
//     })},
//     { new: true }
//   );
//   res.status(200).send({
//     success: true,
//     messsage: "Category Updated Successfully",
//     category,
//   });
// }) 