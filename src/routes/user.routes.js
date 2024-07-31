import { Router } from "express";
import {
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelprofile,
    getUserWatchHistory,
    registerUser
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)


//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/changePassword").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get( verifyJWT ,getCurrentUser)
router.route("/account-details").patch(verifyJWT , updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"),updateUserAvatar)
router.route("/update-coverimage").patch(verifyJWT, upload.single("coverimage"),updateUserCoverImage)
router.route("/channel/:username").get(verifyJWT, getUserChannelprofile)     //params se data liya h isliye aise kra(/channel/:username) second slash ke bad ka data retrive hoga
router.route("/watch-history").get(verifyJWT, getUserWatchHistory)
export default router