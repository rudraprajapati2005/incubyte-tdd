import AuthService from "../service/auth.service.js";

export const registerUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;
     if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }
    //already added the password validity
    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }
    const result = await AuthService.registerUser({ email, password });
    console.log(result);
    res.status(200).json(
      result
    );
  } catch (err) {
    if (next) {
      next(err);
    } else {
      res.status(400).json({ error: err.message });
    }
  }
};
