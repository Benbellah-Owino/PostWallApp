const jwt = require("jsonwebtoken")


// const accessLifetime = process.env.JWT_LIFETIME
// const refreshLifetime = process.env.JWT_R_LIFETIME

// const createAccessToken = (userId, userName, admin, blocked) => {
//     const accessToken = jwt.sign(
//         {
//             userId: userId,
//             userName: userName,
//             admin: admin,
//             blocked: blocked,
//         },
//         process.env.ACCESS_SECRET,
//         {
//             expiresIn: "10m"
//         }
//     )
//     return accessToken
// }

// const createRefreshToken = (userId, userName) => {
//     const refreshToken = jwt.sign(
//         {
//             userId: userId,
//             userName: userName,
//             versionNumber: 1
//         },
//         process.env.REFRESH_SECRET,
//         {
//             expiresIn: "4d"
//         }
//     )

//     return refreshToken
// }

// const sendAccessToken = (req, res, accesstoken) => {
//     console.log(`Access Token:  ${accesstoken}`)
//     res.json({
//         accesstoken,
//         "token_type": "Bearer"
//     })
// }

// const sendRefreshToken = (res, token) => {
//     res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
//     res.cookie("refreshtoken", token, {
//         secure: false,
//         httpOnly: true,
//         maxAge: 24 * 60 * 60 * 1000
//     })
// }

// module.exports = {
//     createAccessToken,
//     createRefreshToken,
//     sendAccessToken,
//     sendRefreshToken
// }


const signToken = (userId, userName) => {
    return jwt.sign({ userId, userName }, process.env.REFRESH_SECRET, { expiresIn: "3d" });
}

const sendToken = (res, token) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:5173');
    res.cookie("authtoken", token, {
        secure: true,
        httpOnly: true,
        sameSite: 'none',
        maxAge: 3 * 24 * 60 * 60 * 1000
    })

}

module.exports = {
    signToken,
    sendToken
}