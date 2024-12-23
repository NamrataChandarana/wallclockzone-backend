import jwt from "jsonwebtoken";

export const sendcookie = (user, res, statuscode = 200, msg) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  res
    .status(statuscode)
    .cookie("token", token, {
      httpOnly: true,
      maxAge: 3 * 60 * 60 * 1000,
      sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
      secure: process.env.NODE_ENV === "Development" ? false : true,
    })
    .json({
      success: true,
      message: msg || "Register successfully!",
      user,
    });
};
