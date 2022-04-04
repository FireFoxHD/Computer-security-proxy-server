import jwt from 'jsonwebtoken';

exports.verifyToken = (req, res, next) => {

    let accessToken = req.cookies.accessToken;
    console.log("Verify token", accessToken)

    if (!accessToken) next();

    jwt.verify(accessToken, process.env.JWT_SECRET, (err, decoded) => {

      if (err) {
        return res.status(401).send({
          message: "Unauthorized!"
        });
      }
      req.userId = decoded.id;
      next();
    });
};