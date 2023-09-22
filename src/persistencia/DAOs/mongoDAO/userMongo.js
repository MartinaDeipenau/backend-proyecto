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

export const deleteUser = async (email) => {
    try {
        const deleteUser = await userModel.deleteOne(email)
        return deleteUser
    } catch (error) {
        return error
    }
}

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

export const updateLastConnection = async (id) => {
    try {
        const updateUser = await userModel.findByIdAndUpdate(
            id,
            { last_connections: Date.now() },
            { new: true }
        );
        return updateUser;
    } catch (error) {
        return error;
    }
}

export const getUserById = async (id) => {
    try {
        const userById = await userModel.findById({ _id: id })
        return userById
    } catch (error) {
        return error
    }
}

export const updateActiveUser = async (filter, update) => {
    try {
        const updateActiveUserRequest = await userModel.updateMany(filter, update)
        return updateActiveUserRequest
    } catch (error) {
        return error
    }
}