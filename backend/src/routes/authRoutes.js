import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import transporter from "../lib/nodemailer.js";
import userAuth from "../middleware/userAuth.js";
const router = express.Router();
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "15d" });
};

function validatePhoneNumber() {
  // example of regex for indian number
  const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
}

// function validateEmail(email) {
//   // example of regex for email

//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   return emailRegex.test(email);
// }

function validateEmail(email, options = {}) 
{
    // Check if email is provided and is a string       
    const firstChar = email.charAt(0);
    // 3. Check if the first character is a number
    // Using a regular expression to check if it's a digit (0-9)
    if (/\d/.test(firstChar)) {
        return false; // First character is a number, so invalid based on your rule
    }

    // 4. (Optional but recommended for general email validation):
    // Add more comprehensive email validation logic here.
    // For a *very basic* email format check (not comprehensive for all edge cases):
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return false; // Fails general email format
    }
    
    if (!email || typeof email !== 'string') {
        return { isValid: false, error: 'Email must be a non-empty string' };
    }

    // Trim whitespace
    email = email.trim();

    // Check minimum and maximum length
    if (email.length < 5) {
        return { isValid: false, error: 'Email is too short (minimum 5 characters)' };
    }
    if (email.length > 254) {
        return { isValid: false, error: 'Email is too long (maximum 254 characters)' };
    }

    // Basic format validation
    const basicRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicRegex.test(email)) {
        return { isValid: false, error: 'Invalid email format' };
    }

    // Comprehensive regex validation
    const comprehensiveRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!comprehensiveRegex.test(email)) {
        return { isValid: false, error: 'Email contains invalid characters or format' };
    }

    // Split into local and domain parts
    const parts = email.split('@');
    if (parts.length !== 2) {
        return { isValid: false, error: 'Email must contain exactly one @ symbol' };
    }

    const [localPart, domainPart] = parts;

    // Validate local part (before @)
    if (localPart.length === 0) {
        return { isValid: false, error: 'Local part (before @) cannot be empty' };
    }
    if (localPart.length > 64) {
        return { isValid: false, error: 'Local part (before @) is too long (maximum 64 characters)' };
    }
    if (localPart.includes('..')) {
        return { isValid: false, error: 'Local part cannot contain consecutive dots' };
    }
    if (localPart.startsWith('.') || localPart.endsWith('.')) {
        return { isValid: false, error: 'Local part cannot start or end with a dot' };
    }

    // Validate domain part (after @)
    if (domainPart.length === 0) {
        return { isValid: false, error: 'Domain part (after @) cannot be empty' };
    }
    if (domainPart.length > 253) {
        return { isValid: false, error: 'Domain part (after @) is too long (maximum 253 characters)' };
    }

    const domainRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    if (!domainRegex.test(domainPart)) {
        return { isValid: false, error: 'Invalid domain format' };
    }

    if (!domainPart.includes('.')) {
        return { isValid: false, error: 'Domain must contain at least one dot' };
    }

    // Validate domain labels
    const domainLabels = domainPart.split('.');
    for (const label of domainLabels) {
        if (label.length === 0) {
            return { isValid: false, error: 'Domain cannot have empty labels' };
        }
        if (label.length > 63) {
            return { isValid: false, error: 'Domain label is too long (maximum 63 characters)' };
        }
        if (label.startsWith('-') || label.endsWith('-')) {
            return { isValid: false, error: 'Domain labels cannot start or end with hyphen' };
        }
    }

    // Validate TLD (top-level domain)
    const tld = domainLabels[domainLabels.length - 1];
    if (tld.length < 2) {
        return { isValid: false, error: 'Top-level domain must be at least 2 characters long' };
    }
    if (/^\d+$/.test(tld)) {
        return { isValid: false, error: 'Top-level domain cannot be numeric only' };
    }

    // Optional: Check for disposable email domains
    if (options.checkDisposable) {
        const disposableDomains = [
            '10minutemail.com', 'guerrillamail.com', 'mailinator.com',
            'tempmail.org', 'throwaway.email', 'temp-mail.org', 'yopmail.com',
            'maildrop.cc', 'tempail.com', '10minute.email'
        ];
        
        const domain = domainPart.toLowerCase();
        if (disposableDomains.includes(domain)) {
            return { isValid: false, error: 'Disposable email addresses are not allowed' };
        }
    }

    // Optional: Check for common typos in popular domains
    if (options.checkTypos) {
        const commonTypos = {
            'gmial.com': 'gmail.com',
            'gmai.com': 'gmail.com',
            'yahooo.com': 'yahoo.com',
            'hotmial.com': 'hotmail.com',
            'outlok.com': 'outlook.com',
            'gnail.com': 'gmail.com',
            'yaho.com': 'yahoo.com'
        };
        
        const domain = domainPart.toLowerCase();
        if (commonTypos[domain]) {
            return {
                isValid: false,
                error: `Did you mean ${commonTypos[domain]}?`,
                suggestion: `${localPart}@${commonTypos[domain]}`
            };
        }
    }

    // If all validations pass
    return {
        isValid: true,
        email: email,
        localPart: localPart,
        domainPart: domainPart,
        message: 'Email is valid'
    };
}

router.get("/", async (req, res) => {
//   console.log(validateEmail("madanpiske@gmail.com"));
//   console.log(validateEmail("madan@mail.@com"), 'this i');
//   console.log('nothing to worry');
  return res.status(200).json({ message: "Nothing to worry, backend is working" });
})

router.post("/register", async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 5) {
        // Password validation Minimum 6 characters
      return res.status(400).json({ message: "Password should be at least 6 characters long" });
    }

    if (username.length < 4) {
        // username validation Minimum 5 characters
      return res.status(400).json({ message: "Username should be at least 3 characters long" });
    }

    // check if user already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already exists" });
    }

    if (validateEmail(email) === false) {
        console.log("Validating code");
      return res.status(400).json({ message: `Invalid email format ${email}` });
    }

    // get random avatar
    const profileImage = `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;

    const user = new User({
      email,
      username,
      password,
      profileImage,
    });

    await user.save();

    const token = generateToken(user._id);

    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
    // send verification email and welcome mail
    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: email,
        subject: "Welcome to Fit Band",
        text: `Welcome to greatestack website. Your account has been created successfully with email id: ${email}.`
    };
    await transporter.sendMail(mailOptions);
    console.log("Welcome email sent to:", email);

  } catch (error) {
    console.log("Error in register route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required" });
    console.log('login route hit');
    // check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // check if password is correct
    const isPasswordCorrect = await user.comparePassword(password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id);

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        profileImage: user.profileImage,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.log("Error in login route", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// (first)send the Verification OTP to the user email
// is it get or post request?
// i think it is post request bcz we are sending otp to validate the user email
router.post("/send-verify-otp",userAuth, async (req, res) => {
    try{
        const { userId } = req.user; // get userId from the token
        console.log("User ID from token:", userId);
        const user = await User.findById(userId);

        console.log("Email from userId:", user.email);
        // if (!userId) return res.status(400).json({ message: "User ID is required" });
        // const { email } = req.body; // i think we are only using email, not username
        if (!user.email) return res.status(400).json({ message: "Email is required" });
        // const user = await User.find({ email });
        // let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        console.log("User found:", user);
        if (user.isAccountVerified) {
            return res.status(400).json({ message: "Account already verified" });
        }

        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate 6 digit otp
        // set otp and expire time in user model
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 5 * 60 * 1000; // set otp expire time to 5 minutes

        await user.save();
        console.log("OTP generated:", otp);

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP for verification is ${otp}. It is valid for 5 minutes.`,
            html: `<div style="font-family: sans-serif; line-height: 1.6;">
                        <p>Hello,</p>
                        <p>Thank you for using our Fitness App!</p>
                        <p>Your One-Time Password (OTP) for verification is:</p>
                        <h2 style="color: pink; font-size: 24px; text-align: center; background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
                            ${otp}
                        </h2>
                        <p>Please use this OTP to complete your login or registration. This OTP is valid for **5 minutes**.</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <br>
                        <p>Regards,</p>
                        <p>@The Fitness smart brand ankle Team</p>
                    </div>`,
        };

        await transporter.sendMail(mailOptions);
        console.log("Verification OTP sent to:", user.email);

    }catch (error) {
        console.log("Error in send-verify-otp route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// (second)verify the OTP sent to the user email 
// validate otp and enter correct otp
router.post("/get-verify-otp", userAuth,async (req, res) => {
    try {
        const { userId } = req.user; // get userId from the token
        // console.log("User ID from token:", userId);
        const user = await User.findById(userId);
        
        console.log("Email from userId:", user.email);
        const { otp } = req.body;

        if (!otp) return res.status(400).json({ message: "Please Enter OTP" });

        // check if user exists
        // const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // check if otp is correct or validate it
        if (user.verifyOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });

        // check if otp is expired
        const currentTime = Date.now();
        if (currentTime > user.verifyOtpExpireAt) {
            return res.status(400).json({ message: "OTP has expired" });
        }

        // update user account as verified
        user.isAccountVerified = true;
        user.verifyOtp = "";
        user.verifyOtpExpireAt = 0;
        await user.save();
        console.log("Account verified successfully for user:", user.email);
        res.status(200).json({ message: "Account verified successfully" });
    } catch (error) {
        console.log("Error in get-verify-otp route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// check if user is logged in or not
// or check if the user is authenticated

// password reset otp
// (first)send the Reset OTP to the user email
router.post("/send-reset-otp", async (req, res) => {
    try {
        const {email} = req.body;
        if (!email) return res.status(400).json({ message: "Email not found" });  

        // const { userId } = req.user; // get userId from the token
        const user = await User.findOne({email});
        
        if (!user) return res.status(400).json({ message: "User Not Found" });
        // generate otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generate 6 digit otp
        // set otp and expire time in user model
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000; // set otp expire time to 5 minutes
        await user.save();
        console.log("Reset OTP generated:", otp);
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP for password reset is ${otp}. It is valid for 5 minutes.`,
            html: `<div style="font-family: sans-serif; line-height: 1.6;">
                        <p>Hello,</p>
                        <p>We received a request to reset your password.</p>
                        <p>Your One-Time Password (OTP) for resetting your password is:</p>
                        <h2 style="color: pink; font-size: 24px; text-align: center; background-color: #f2f2f2; padding: 10px; border-radius: 5px;">
                            ${otp}
                        </h2>
                        <p>Please use this OTP to reset your password. This OTP is valid for **5 minutes**.</p>
                        <p>If you did not request this, please ignore this email.</p>
                        <br>
                        <p>Regards,</p>
                        <p>@The Fitness smart brand ankle Team</p>
                    </div>`,
        };
        await transporter.sendMail(mailOptions);
        console.log("Password reset OTP sent to:", user.email);
        res.status(200).json({ message: "Reset OTP sent to your email" });
    } catch (error) {
        console.log("Error in send-reset-otp route", error);
        res.status(500).json({ message: "Internal server error" });
    }
    });


// (second)verify the Reset OTP sent to the user email (enter correct otp)
router.post("/verify-reset-otp", async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields are required" });
        // check if user exists
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });
        // check if otp is correct
        if (user.resetOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
        // check if otp is expired
        const currentTime = Date.now();
        if (currentTime > user.resetOtpExpireAt) {
            return res.status(400).json({ message: "OTP has expired" });
        }
        // reset otp and expire time in user model
        if (newPassword.length < 6) {
            return res.status(400).json({ message: "Password should be at least 6 characters long" });
        }

        // update user password
        // const hashedPassword = await bcrypt.hash(newPassword, 10);
        // user.password = hashedPassword; // update password
        user.password = newPassword; // update password
        // user.password = newPassword; // update password
        user.isAccountVerified = true; // mark account as verified
        // reset otp and expire time in user model
        // user.verifyOtp = ""; // clear verify otp

        user.resetOtp = "";
        user.resetOtpExpireAt = 0;
        await user.save();

        res.status(200).json({ message: "OTP verified successfully, Password changed successfully" });
    } catch (error) {
        console.log("Error in verify-reset-otp route", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;






























































// router.post("/verify-otp", async (req, res) => {
//     try {
//         const { email, otp } = req.body;
    
//         if (!email || !otp) return res.status(400).json({ message: "All fields are required" });
    
//         // check if user exists
//         const user = await User.findOne({ email });
//         if (!user) return res.status(400).json({ message: "User not found" });
    
//         // check if otp is correct
//         if (user.verifyOtp !== otp) return res.status(400).json({ message: "Invalid OTP" });
    
//         // check if otp is expired
//         const currentTime = Date.now();
//         if (currentTime > user.verifyOtpExpireAt) {
//         return res.status(400).json({ message: "OTP has expired" });
//         }
    
//         // update user account as verified
//         user.isAccountVerified = true;
//         user.verifyOtp = "";
//         user.verifyOtpExpireAt = 0;
//         await user.save();
    
//         res.status(200).json({ message: "Account verified successfully" });
//     } catch (error) {
//         console.log("Error in verify-otp route", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
//     });