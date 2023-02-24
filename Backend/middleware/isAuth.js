// const { verify } = require("jsonwebtoken");

// const isAuth = (req, res) => {
//     const authorization = req.headers.authorization;
//     if (!authorization) {

//         throw new Error("You need to login")
//     }
//     else {
//         try {
//             console.log(authorization)
//             const token = authorization.split(" ")[1];
//             console.log(token)
//             const decodedToken = verify(token, process.env.ACCESS_SECRET);
//             console.log(decodedToken)
//         } catch (error) {
//             console.log(error)
//         }
//     }
// }

// module.exports = isAuth

const jwt = require("jsonwebtoken");


const isAuth = async (req, res) => {

    try {
        const { authtoken } = req.cookies;

        if (!authtoken) {
            console.log('Please login to access the data');
        }
        else {
            const verify = jwt.verify(authtoken, process.env.REFRESH_SECRET);
            //console.log(verify)
            return verify
        }
    } catch (error) {
        console.log(error)
    }




};

module.exports = isAuth;