import { userModel } from '../../mongoDB/models/user.js'

export const getUsers = async (req, res) => {
    try {
        const users = await userModel.find()
        return users
    } catch (error) {
        return error
    }
}

export const getUsersByEmail = async (email) => {
    try {
        const user = await userModel.findOne(email)
        return user
    } catch (error) {
        return error
    }
}

/*export const deleteUser = async (email) => {
    try {
        const deleteUser = await userModel.deleteOne(email)
        return deleteUser
    } catch (error){
        return error
    }
}*/

export const getUsersByCustomFilter = async (filter) => {
    try {
        const user = await userModel.findOne(filter)
        return user
    } catch (error) {
        return error
    }
}

export const changeRole = async (id, obj) => {
    try {
        const newRole = await userModel.findByIdAndUpdate(id, obj)
        return newRole
    } catch (error) {
        return error
    }
}