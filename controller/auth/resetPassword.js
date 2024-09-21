import User from "../../models/user.js"
import bcrypt, { hash } from "bcrypt"
import { isStrongPassword, isValidUserId } from "../../utils/validator.js"

const resetPassword = async (req, res) => {
    const { password } = req.body
    const { token, id } = req.query
    // token , id , password validation

    if (!token) {
        return res.json({ success: false, message: 'Invalid data' })
    }
    if (!isStrongPassword(password))
        return res.json({ success: false, message: 'Require a strong password' })

    if (!isValidUserId(id))
        return res.json({ success: false, message: 'Invalid userId' })


    try {
        const user = await User.findOne({ hash: token, _id: id })
        if (!user) return res.status(400).json({ success: false, message: "User not found" })

        const saltPass = await bcrypt.genSalt(10)
        const hashPass = await bcrypt.hash(password, saltPass)

        user.password = hashPass
        user.hash = undefined

        await user.save()

        res.json({
            success: true,
            message: "Password reset successfully"
        })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: 'Something went wrong' })
    }
}

export default resetPassword