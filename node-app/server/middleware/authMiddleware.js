import jwt from "jsonwebtoken";

const JWT_SECRET = "JWT_KEY";

const authMiddleware = (allowedRoles = []) => {
  return (req, res, next) => {
    console.log("Middleware invoked");
    console.log("Request Headers:", req.headers);

    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      console.log("Authorization header missing");
      return res.status(401).json({ error: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];
    console.log("Token:", token);

    if (!token) {
      console.log("Token missing");
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("Decoded Token:", decoded);
      req.user = decoded;

      if (allowedRoles.length > 0 && !allowedRoles.includes(decoded.role)) {
        console.log("Insufficient permissions");
        return res
          .status(403)
          .json({ error: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (error) {
      console.error("Token Verification Error:", error);
      return res.status(401).json({ error: "Unauthorized" });
    }
  };
};

export default authMiddleware;
