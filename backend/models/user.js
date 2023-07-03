const mongoose = require("mongoose");

const crypto2 = require("crypto");
const { v1: uuidv1 } = require("uuid");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            trim: true,
            required: true
        },

        lastName: {
            type: String,
            trim: true,
            required: true
        },

        email: {
            type: String,
            trim: true,
            unique: true,
            required: true
        },

        mobileNumber: {
            type: Number,
            unique: true,
        },

        photo: {
            type: String,
            default: "https://cdn.pixabay.com/photo/2016/03/31/19/56/avatar-1295402_1280.png"
        },

        encry_password: {
            type: String,
            required: true,
        },

        salt: String,

    },
    { timestamps: true }
)


userSchema.pre("save", async function (next) {
    if (!this.isModified("encry_password")) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.salt = salt;
    this.encry_password = await bcrypt.hash(this.encry_password,
        salt);
    next();
});

userSchema.methods.validPassword = async function (password) {
    return await bcrypt.compare(password, this.encry_password);
};



// userSchema
//     .virtual("password")
//     .set(function (password) {
//         this._password = password;
//         this.salt = uuidv1;
//         this.encry_password = this.securePassword(password);
//     })
//     .get(function () {
//         return this._password;
//     });

// userSchema.methods = {
//     authenticate: function (plainPassword) {
//         return this.securePassword(plainPassword) === this.encry_password;
//     },

//     securePassword: function (plainPassword) {
//         if (!plainPassword) return "";

//         try {
//             return crypto2
//                 .createHmac("sha256", this.salt)
//                 .update(plainPassword)
//                 .digest("hex");
//         } catch (err) {
//             return "";
//         }
//     },
// };

module.exports = mongoose.model("User", userSchema);
