import AuthService from "../service/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.registerUser({ email, password });
    res.status(200).json(result); // 201 Created is more RESTful
  } catch (err) {
    next(err);
  }
};
