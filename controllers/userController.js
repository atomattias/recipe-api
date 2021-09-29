const User = require("../model/user");
const Recipe = require("../model/recipe");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { where } = require("../model/user");

// get a user detail
// exports.user = function (req, res) {
//   res.send("NOT IMPLEMENTED: User detail " + req.params.id);
// };

// user index
exports.index = function (req, res) {
  console.log(req);
  res.status(200).send("NOT IMPLEMENTED: User index" + req.user.first_name);
};

// list users - Super Admin
exports.list = async function (req, res) {
  const user = await User.find({})
    .populate({
      path: "_recipes",
      model: Recipe,
    })
    .limit(20)
    .exec();
  return res.status(200).json(user);
};

// User registration
exports.register = async function (req, res) {
  try {
    // Get user input
    const { first_name, last_name, email, password } = req.body;

    // Validate user input
    if (!(email && password && first_name && last_name)) {
      return res.status(400).send("All input is required");
    }

    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email });

    if (oldUser) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    //Encrypt user password
    encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(), // sanitize: convert email to lowercase
      password: encryptedPassword,
    });

    user.save();
    res.status(201).json(user);
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
};

// User Login
exports.login = async function (req, res) {
  try {
    // Get user input
    const { email, password } = req.body;
    // Validate user input
    if (!(email && password)) {
      res.status(400).send("All input is required");
    }
    // Validate if user exist in our database
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );
      // save user token
      user.token = token;
      user.save();
      // user
      return res.status(200).json(user);
    }
    return res.status(400).send("Invalid Credentials");
  } catch (err) {
    console.log(err);
    return res.status(401).send("Something went wrong");
  }
};

// User update
exports.update = async function (req, res) {
  try {
    const user_email = req.user.email;
    // check if user already exist
    // Validate if user exist in our database
    const oldUser = await User.findOne({ email: user_email });

    if (oldUser) {
      // Get user input
      const { first_name, last_name, password } = req.body;

      // Validate user input
      if (!(password && first_name && last_name)) {
        return res.status(400).send("All input is required");
      }

      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);

      // Create user in our database
      const user = await User.findOneAndUpdate(
        { email: user_email },
        {
          first_name,
          last_name,
          password: encryptedPassword,
        }
      );

      // Create token
      const token = jwt.sign(
        { user_id: user._id, user_email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

      // save user token
      user.token = token;

      // return new user
      res.status(201).json(user);
    }
  } catch (err) {
    console.log(err);
  }
};

// user logout
exports.logout = async function (req, res) {
  // console.log(req.user);
  // Validate if user exist in our database
  const user = await User.findOne({ email: req.user.email });

  user.deleteToken(user.token, (err, user) => {
    if (err) return res.status(400).json(err);
    res.status(200).json(user);
  });
};
