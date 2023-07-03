const User = require("../models/user");

exports.getUserProfile = async (req, res) => {
    const userId = req.params.userId;

    User.findById(userId).select(["-encry_password -salt", "-salt"])
        .then((user) => {

            // let binary = Buffer.from(user.photo.data); //or Buffer.from(data, 'binary')
            // let imgData = new Blob(binary.buffer, { type: 'application/octet-binary' });
            // let link = URL.createObjectURL(imgData);

            // let img = new Image();
            // img.onload = () => URL.revokeObjectURL(link);
            // img.src = link;
            // user.photo = img;
            res.send(user)
        })
        .catch((error) => {
            res.send({
                "message": "User not found",
                "error": error
            })
        })
}

exports.getAllUsers = async (req, res) => {

    let keyword = {}

    if (req.query.search) {
        const queryString = !isNaN(Number(req.query.search)) && Number(req.query.search) > 1000000000 ?
            {
                type: "number",
                value: Number(req.query.search)
            } : {
                type: "string",
                value: req.query.search
            };

        keyword =
            queryString.type === "number" ?
                { mobileNumber: queryString.value }
                : {
                    $or: [
                        { name: { $regex: queryString.value, $options: "i" } },
                        { email: { $regex: queryString.value, $options: "i" } },
                    ]
                };

    }

    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } }).select(["-encry_password -salt"])

    return res.send(users);

}

exports.findUser = async (req, res) => {

    let keyword = {}

    if (req.query.search) {
        const queryString = !isNaN(Number(req.query.search)) && Number(req.query.search) > 1000000000 ?
            {
                type: "number",
                value: Number(req.query.search)
            } : {
                type: "string",
                value: req.query.search
            };

        keyword =
            queryString.type === "number" ?
                { mobileNumber: queryString.value }
                : { email: queryString.value }

        const users = await User.findOne(keyword).find({ _id: { $ne: req.user._id } }).select(["-encry_password -salt"])

        return res.send(users);

    }

    return res.send("Enter the user's email or mobile number")


}


