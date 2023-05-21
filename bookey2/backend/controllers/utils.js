const jwt = require('jsonwebtoken');

exports.verifyAuth = (req, res, info) => {
    const cookie = req.cookies;
    if (!cookie.accessToken || !cookie.refreshToken) {
        return { authorized: false, message: "Unauthorized" };
    }
    try {
        const decodedAccessToken = jwt.verify(cookie.accessToken, process.env.ACCESS_KEY);
        const decodedRefreshToken = jwt.verify(cookie.refreshToken, process.env.ACCESS_KEY);

        if (!decodedAccessToken.Name || !decodedAccessToken.Email || decodedAccessToken.isAdmin == undefined) {
            return { authorized: false, message: "Token is missing information" };
        }
        if (!decodedRefreshToken.Name || !decodedRefreshToken.Email || decodedRefreshToken.isAdmin == undefined) {
            return { authorized: false, message: "Token is missing information" };
        }
        if (decodedAccessToken.Name !== decodedRefreshToken.Name || decodedAccessToken.Email !== decodedRefreshToken.Email || decodedAccessToken.isAdmin !== decodedRefreshToken.isAdmin) {
            return { authorized: false, message: "Mismatched users" };
        }

        // authType === "User"
        if (info.authType === "User" && (decodedAccessToken.Email !== info.Email)) {
            return { authorized: false, message: "Wrong User auth request" };
        }
        // authType === "Admin"
        else if (info.authType === "Admin" && !decodedAccessToken.isAdmin) {
            return { authorized: false, message: "Wrong Admin auth request" };
        }

        return { authorized: true, message: "Authorized" };
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            try {
                const refreshToken = jwt.verify(cookie.refreshToken, process.env.ACCESS_KEY)

                // Refresh the token even if the request is bad
                const newAccessToken = jwt.sign({
                    Name: refreshToken.Name,
                    Email: refreshToken.Email,
                    User_ID: refreshToken.User_ID,
                    isAdmin: refreshToken.isAdmin
                }, process.env.ACCESS_KEY, { expiresIn: '1h' })
                res.cookie('accessToken', newAccessToken, { httpOnly: true, path: process.env.PATH, maxAge: 60 * 60 * 1000, sameSite: 'none', secure: true })
                res.locals.message = 'Access token has been refreshed. Remember to copy the new one in the headers of subsequent calls'

                // authType === "User"
                if (info.authType === "User" && (refreshToken.Email !== info.Email)) {
                    return { authorized: false, message: "Wrong User auth request" };
                }
                // authType === "Admin"
                else if (info.authType === "Admin" && !refreshToken.isAdmin) {
                    return { authorized: false, message: "Wrong Admin auth request" };
                }

                return { authorized: true, message: "Authorized" };
            } catch (err) {
                if (err.name === "TokenExpiredError") {
                    return { authorized: false, message: "Perform login again" };
                } else {
                    return { authorized: false, message: err.name };
                }
            }
        } else {
            return { authorized: false, message: err.name };
        }
    }
}