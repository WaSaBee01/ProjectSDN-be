const User = require('../models/UserModel');
const Order = require('../models/OrderProduct');
const bcrypt = require("bcrypt");
const { genneralAccessToken, genneralRefreshToken } = require('./jwtService');


const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { name, email, password, confirmPassword, phone } = newUser;

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'Email already exists'
                })
            }

            const hash = bcrypt.hashSync(password, 10);
            const createdUser = await User.create({
                name,
                email,
                password: hash,
                phone
            })
            if (createdUser) {
                resolve({
                    status: 'OK',
                    message: 'User created successfully',
                    data: createdUser
                })
            }
        } catch (e) {
            reject(e);
        }
    });
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {
        const { email, password } = userLogin;

        try {
            const checkUser = await User.findOne({
                email: email
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The email does not exist'
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password);

            if (!comparePassword) {
                resolve({
                    status: 'ERR',
                    message: 'Password is incorrect'
                })
            }
            const access_token = await genneralAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await genneralRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            resolve({
                status: 'OK',
                message: 'User login successfully',
                access_token,
                refresh_token
            })
        } catch (e) {
            reject(e);
        }
    });
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {

        try {
            const checkUser = await User.findOne({
                _id: id
            })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user does not exist'
                })
            }

            const updatedUser = await User.findByIdAndUpdate(id, data, { new: true })

            resolve({
                status: 'OK',
                message: 'User update successfully',
                data: updatedUser
            })
        } catch (e) {
            reject(e);
        }
    });
}

const deleteUser = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkUser = await User.findOne({ _id: id });
      if (checkUser === null) {
        return resolve({
          status: 'ERR',
          message: 'The user does not exist'
        });
      }

      const hasOrder = await Order.exists({ user: id });
      if (hasOrder) {
        return resolve({
          status: 'ERR',
          message: 'Cannot delete users with existing orders.'
        });
      }

      await User.findByIdAndDelete(id);

      resolve({
        status: 'OK',
        message: 'Delete user success',
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteManyUser = (ids) => {
    return new Promise(async (resolve, reject) => {
        try {

            await User.deleteMany({ _id: ids })

            resolve({
                status: 'OK',
                message: 'Delete user success',
            })
        } catch (e) {
            reject(e);
        }
    });
}

const getAllUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find()

            resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            reject(e);
        }
    });
}

const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: id
            })
            if (user === null) {
                resolve({
                    status: 'ERR',
                    message: 'The user does not exist'
                })
            }

            resolve({
                status: 'OK',
                message: 'Success',
                data: user
            })
        } catch (e) {
            reject(e);
        }
    });
}




module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    deleteManyUser
}