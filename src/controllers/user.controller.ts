import { Request, Response } from 'express';
import { Otp } from '../models/Otp.model';
import bcrypt from "bcryptjs";
import { signToken, TokenPayload } from '../utils/jwt';
import crypto from 'crypto';
// import { sendOtpEmail } from '../utils/sendEmail';
import { User } from '../models/User.model';


// export const generateOtpController = async (req: Request, res: Response): Promise<any> => {
//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({
//             message: "Email is required"
//         })
//     }

//     try {

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         await Otp.findOneAndUpdate(
//             { email },
//             {
//                 $set: {
//                     email: email,
//                     otp: hashedOtp,
//                     otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
//                     isVerified: false
//                 }
//             },
//             {
//                 upsert: true,
//                 returnDocument: "after",
//             }
//         );

//         await sendOtpEmail(email, otp);

//         res.status(200).json({
//             message: "Otp generated Successfully",
//         });

//     } catch (error: any) {
//         console.error("Error while generating otp: ", error);
//         return res.status(500).json({
//             message: "Some error occured while generating the otp.",
//             error: error,
//         })
//     }
// };


// export const verifyOtpController = async (req: Request, res: Response): Promise<any> => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         return res.status(400).json({
//             message: "Email and Otp are required"
//         })
//     }

//     try {
//         const user = await Otp.findOne({
//             email
//         });

//         if (!user) {
//             return res.status(404).json({
//                 message: "Firse Generate the otp."
//             })
//         }

//         if (!user.otp || !user.otpExpiry) {
//             return res.status(400).json({
//                 message: "Otp not found or already verified."
//             })
//         };

//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         if (hashedOtp !== user.otp) {
//             return res.status(400).json({
//                 message: "Invalid Otp"
//             })
//         };

//         if (user.otpExpiry.getTime() < Date.now()) {
//             return res.status(400).json({
//                 message: "Otp expired"
//             })
//         }

//         await Otp.updateOne({ email }, {
//             $set: {
//                 isVerified: true
//             }
//         })

//         return res.status(200).json({
//             message: "Email Verified successfully."
//         })
//     } catch (error) {
//         console.error("Error while verifying the otp: ", error);
//         return res.status(500).json({
//             message: "Something went wrong while verifying the otp.",
//         })

//     }
// };


// export const signupController = async (req: Request, res: Response): Promise<any> => {
//     const { name, email, password } = req.body;

//     if (!name || !email || !password) {
//         return res.status(400).json({
//             message: "Name, Email and Password are required."
//         })
//     }

//     try {
//         const existingUser = await User.findOne({
//             email
//         })

//         if (existingUser) {
//             return res.status(400).json({
//                 message: "User already exists."
//             })
//         }

//         const Otpverifed = await Otp.findOne({
//             email
//         })

//         if (!Otpverifed || Otpverifed?.isVerified === false) {
//             return res.status(400).json({
//                 message: "Email is not verified"
//             })
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);

//         const user = await User.create({
//             name,
//             email,
//             password: hashedPassword,
//             isEmailVerified: true
//         })

//         const token = signToken({
//             userId: user._id.toString(),
//             email
//         })

//         await Otp.deleteOne({
//             email
//         })

//         return res.status(201).json({
//             message: "You are successfully signed up.",
//             token
//         })

//     } catch (error: any) {
//         console.error("Error while signing up: ", error);
//         return res.status(500).json({
//             message: "Internal Server Error.",
//         })
//     }
// };

export const manuallySignupController = async(req: Request, res: Response): Promise<any> => {
    const {name, email, password} = req.body;

    if(!name || !email || !password){
        return res.status(400).json({
            message : "Name, Email and Password are required."
        });
    };

    try{
        const existingUser = await User.findOne({
            email
        });
        if(existingUser){
            return res.status(400).json({
                message : "User already exists.",
            });
        };

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            isEmailVerified: false
        });

        const token = signToken({
            userId: user._id.toString(),
            email
        });

        return res.status(201).json({
            message : "You are successfully signed up.",
            token
        })

    }catch(error){
        console.error("Error while signing up: ", error);
        return res.status(500).json({
            message : "Internal Server error."
        });
    };
}


export const signinController = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            message: "Email and password are required.",
        });
    };

    try {

        const user = await User.findOne({
            email
        });

        if (!user || !user.password) {
            return res.status(400).json({
                message: "Invalid email or password. Try to signup first."
            })
        };

        const matchPassword = await bcrypt.compare(password, user.password);

        if (!matchPassword) {
            return res.status(400).json({
                message: "Incorrect Password",
            });
        };

        const token = signToken({
            userId: user._id.toString(),
            email: user.email
        })

        return res.status(200).json({
            message: "Signed in Successfully.",
            token: token,
        })

    } catch (error: any) {
        console.error("Error while siginig in : ", error)
        return res.status(500).json({
            message: "Something went wrong while signing in.",
        })
    }
};


export const meController = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req.user as TokenPayload).userId;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(400).json({
                message: "No such user exist. Try to signin first."
            });
        };

        const passwordData = await User.findById(userId).select("password");
        const passwordLength = passwordData?.password ? 8 : 0;

        return res.status(200).json({
            message: "User data fetched successfully.",
            user,
            passwordLength
        })

    } catch (error) {
        console.error("Error while users data: ", error);
        return res.status(500).json({
            message: "Internal Server Error."
        })
    }
};


export const deleteAccountController = async (req: Request, res: Response): Promise<any> => {
    try {
        const userId = (req.user as TokenPayload).userId;
        await User.findByIdAndDelete(userId);
        return res.status(200).json({
            message: "Account deleted successfully."
        });
    } catch (error) {
        console.error("Error while deleting accound: ", error);
        return res.status(500).json({
            message: "Internal Server Error.",
        });
    };
};


export const updateNameController = async (req: Request, res: Response): Promise<any> => {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
        return res.status(400).json({
            message: "Name is required.",
        });
    };

    try {
        const userId = (req.user as TokenPayload).userId;
        const user = await User.findByIdAndUpdate(userId,
            {
                $set: {
                    name: name.trim(),
                }
            },
            {
                returnDocument: "after",
            }
        );

        if (!user) {
            return res.status(400).json({
                message: "User does not exist."
            });
        };

        return res.status(200).json({
            message: "Name updated successfully."
        })

    } catch (error) {
        console.error("Error while updating the name: ", error);
        return res.status(500).json({
            message: "Internal Server error."
        });
    };
};


// export const updatePasswordGenerateOtpController = async (req: Request, res: Response): Promise<any> => {
//     try {
//         const userId = (req.user as TokenPayload).userId;

//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(404).json({
//                 message: "User does not exist."
//             });
//         };

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         await Otp.findOneAndUpdate({
//             email: user.email
//         }, {
//             $set: {
//                 email: user.email,
//                 otp: hashedOtp,
//                 otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
//                 isVerified: false,
//             }
//         }, {
//             upsert: true,
//             returnDocument: "after",
//         })

//         await sendOtpEmail(user.email, otp);

//         return res.status(200).json({
//             message: "Otp send successfully."
//         })

//     } catch (error) {
//         console.error("Error occured while generating the otp from updating the password: ", error);
//         return res.status(500).json({
//             message: "Internal Server Error."
//         });
//     };
// };


// export const updatePasswordVerifyOtpController = async (req: Request, res: Response): Promise<any> => {
//     const { otp } = req.body;

//     if (!otp) {
//         return res.status(400).json({
//             message: "Otp is missing. Try to generate first."
//         });
//     };

//     try {

//         const userId = (req.user as TokenPayload).userId;
//         const user = await User.findById(userId);
//         if (!user) {
//             return res.status(400).json({
//                 message: "User does not exist"
//             })
//         };

//         const email = user.email;

//         const otpRecord = await Otp.findOne({ email });

//         if (!otpRecord) {
//             return res.status(400).json({
//                 message: "Otp not found. Please generate otp first."
//             })
//         }

//         if (!otpRecord.otp) {
//             return res.status(400).json({
//                 message: "Otp not found or already verified."
//             })
//         }

//         if (otpRecord.otpExpiry.getTime() < Date.now()) {
//             return res.status(400).json({
//                 message: "Otp Expired."
//             })
//         }

//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         if (hashedOtp !== otpRecord.otp) {
//             return res.status(400).json({
//                 message: "Invalid Otp"
//             })
//         }

//         await Otp.updateOne({
//             email
//         }, {
//             $set: {
//                 isVerified: true,
//             }
//         })


//         return res.status(200).json({
//             message: "Otp verified successfully."
//         })

//     } catch (error) {
//         console.error("Error while verifying otp for updating the password: ", error);
//         return res.status(500).json({
//             message: "Internal Server Error."
//         })
//     }
// };


// export const updatePasswordController = async (req: Request, res: Response): Promise<any> => {
//     const { newPassword } = req.body;

//     if (newPassword.length <= 8) {
//         return res.status(400).json({
//             message: "Password should be at least of 8 characters."
//         });
//     };

//     try {
//         const userId = (req.user as TokenPayload).userId;

//         const user = await User.findById(userId);

//         if (!user) {
//             return res.status(400).json({
//                 message: "User does not exist."
//             })
//         }

//         const otpRecord = await Otp.findOne({
//             email: user.email
//         });

//         if (!otpRecord) {
//             return res.status(400).json({
//                 message: "Otp not found. Please generate otp first."
//             })
//         }

//         if (!otpRecord.isVerified) {
//             return res.status(400).json({
//                 message: "Otp is not verified. Please first verify the otp."
//             })
//         }

//         const hashedNewPassword = await bcrypt.hash(newPassword, 10);

//         await User.findByIdAndUpdate(user._id, {
//             $set: {
//                 password: hashedNewPassword,
//             }
//         }, {
//             returnDocument: "after",
//         });

//         await otpRecord.deleteOne();

//         return res.status(200).json({
//             message: "Password updated successfully."
//         })

//     } catch (error) {
//         console.error("Error while updating the password: ", error);
//         return res.status(500).json({
//             message: "Internal Server Error."
//         })
//     }
// };


// export const forgotPasswordGenerateOtpController = async (req: Request, res: Response): Promise<any> => {

//     const { email } = req.body;

//     if (!email) {
//         return res.status(400).json({
//             message: "Email is required"
//         });
//     };

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({
//                 message: "User does not exist."
//             });
//         };

//         const otp = Math.floor(100000 + Math.random() * 900000).toString();
//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         await Otp.findOneAndUpdate({
//             email
//         }, {
//             $set: {
//                 email: email,
//                 otp: hashedOtp,
//                 otpExpiry: new Date(Date.now() + 5 * 60 * 1000),
//                 isVerified: false,
//             }
//         }, {
//             returnDocument: "after",
//             upsert: true,
//         });

//         await sendOtpEmail(email, otp);

//         return res.status(200).json({
//             message: `Otp send to ${email} successfully.`
//         });
//     } catch (error: any) {
//         console.error("Error while gererating otp to reset Password: ", error);
//         return res.status(500).json({
//             message: "Internal Server Error.",
//         });
//     };
// };


// export const forgotPasswordVerifyOtpController = async (req: Request, res: Response): Promise<any> => {
//     const { email, otp } = req.body;

//     if (!email || !otp) {
//         return res.status(400).json({
//             message: "Email and otp are required."
//         });
//     };

//     try {
//         const otpRecord = await Otp.findOne({ email });

//         if (!otpRecord) {
//             return res.status(400).json({
//                 message: "Otp not found. Please generate otp first.",
//             });
//         };

//         if (!otpRecord.otp) {
//             return res.status(400).json({
//                 message: "Otp not found or already verified.",
//             });
//         };

//         if (otpRecord.otpExpiry.getTime() < Date.now()) {
//             return res.status(400).json({
//                 message: "Otp Expired.",
//             });
//         };

//         const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

//         if (hashedOtp !== otpRecord.otp) {
//             return res.status(400).json({
//                 message: "Invalid Otp.",
//             });
//         };

//         await Otp.findOneAndUpdate({
//             email
//         }, {
//             $set: {
//                 isVerified: true,
//             }
//         }, {
//             returnDocument: "after",
//         });

//         return res.status(200).json({
//             message: "Otp verified successfully."
//         });

//     } catch (error: any) {
//         console.error("Error while verifying the otp for reset Password: ", error);

//         return res.status(500).json({
//             message: "Internal Server Error."
//         });
//     };
// };


// export const forgotPasswordResetController = async (req: Request, res: Response): Promise<any> => {
//     const { email, newPassword } = req.body;

//     if (!email || !newPassword) {
//         return res.status(400).json({
//             message: "Email and new Password are required.",
//         });
//     };

//     if (newPassword.length < 8) {
//         return res.status(400).json({
//             message: "Password must be at least 8 characters long.",
//         })
//     }

//     try {
//         const user = await User.findOne({ email });

//         if (!user) {
//             return res.status(400).json({
//                 message: "User does not exist."
//             });
//         };

//         const otpRecord = await Otp.findOne({ email });

//         if (!otpRecord) {
//             return res.status(400).json({
//                 message: "Otp not found. Try to generate otp first.",
//             });
//         };

//         if (!otpRecord.isVerified) {
//             return res.status(400).json({
//                 message: "Otp is not verified. First verify it."
//             });
//         };

//         const hashedPassword = await bcrypt.hash(newPassword, 10);

//         await User.updateOne({ email }, {
//             $set: {
//                 password: hashedPassword,
//             }
//         });

//         await otpRecord.deleteOne();

//         return res.status(200).json({
//             message: "Password reset successfully.",
//         });

//     } catch (error) {
//         console.error("Error while reseting the password: ", error);
//         return res.status(500).json({
//             message: "Internal Server Error."
//         });
//     };
// };