const User = require("../models/User");

const userController = {
    getAllUsers: async(req, res)=>{
        try {
            const user = await User.find();
            res.status(200).json(user);
        } catch (err) {
            res.status(500).json(err);
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            if (!user) {
                return res.status(404).json("Người dùng không tồn tại");
            }
            res.status(200).json("Xóa thành công");
        } catch (err) {
            res.status(500).json("Đã xảy ra lỗi khi xóa người dùng");
        }
    }
}
module.exports = userController;