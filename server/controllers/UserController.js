const User = require("../models/User");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("../services/jwt");
const fs = require('fs');

const register = async (req, res) => {
    if (req.body.name && req.body.username && req.body.email && req.body.password) {
        const nameValidator = !validator.isEmpty(req.body.name.trim()) && validator.isLength(req.body.name.trim(), { min: 3, max: 35 });
        const usernameValidator = !validator.isEmpty(req.body.username.trim()) && validator.isLength(req.body.username.trim(), { min: 3, max: 35 });
        const emailValidator = !validator.isEmpty(req.body.email.trim()) && validator.isEmail(req.body.email.trim());
        const passwordValidator = !validator.isEmpty(req.body.password.trim()) && validator.isLength(req.body.password.trim(), { min: 3, max: 255 });
        if (!nameValidator || !usernameValidator || !emailValidator || !passwordValidator) {
            return res.status(400).json({
                status: "error",
                mensaje: "No ha pasado las validaciones de campos"
            })
        }
    } else {
        return res.status(400).json({
            status: "error",
            mensaje: "No ha pasado las validaciones de campos"
        })
    }

    const userValidator = await User.find({ email: req.body.email });

    if (userValidator.length >= 1) {
        return res.status(400).json({
            status: "error",
            mensaje: "Ya existe un email igual"
        })
    }

    const entity = new User(req.body);
    entity.password = await bcrypt.hash(req.body.password, 10);
    entity.photo = {
        path: req.file !== undefined ? req.file.path : '',
        filename: req.file !== undefined ? req.file.filename : ''
    }
    const user = await entity.save();
    return res.status(200).json({
        status: "success",
        user
    })
}

const login = async (req, res) => {
    if (req.body.password) {
        let emailValidator = false;
        const passwordValidator = !validator.isEmpty(req.body.password.trim()) && validator.isLength(req.body.password.trim(), { min: 3, max: 255 });
        if (req.body.email) {
            emailValidator = !validator.isEmpty(req.body.email.trim()) && validator.isEmail(req.body.email.trim());
            if (!emailValidator || !passwordValidator) {
                return res.status(400).json({
                    status: "error",
                    mensaje: "No ha pasado las validaciones de campos"
                })
            }
        }
    } else {
        return res.status(400).json({
            status: "error",
            mensaje: "No ha pasado las validaciones de campos"
        })
    }

    //obtener el usuario
    const user = await User.findOne({ email: req.body.email })

    if (!user) {
        return res.status(400).json({
            status: "error",
            mensaje: "Usuario o contraseña incorrecta"
        })
    } else {
        const validatePassword = await bcrypt.compare(req.body.password, user.password);
        if (!validatePassword) {
            return res.status(400).json({
                status: "error",
                mensaje: "Usuario o contraseña incorrecta"
            })
        } else {
            const token = jwt.generateToken(user);
            return res.status(200).json({
                status: "success",
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    compania: user.compania
                },
                token
            })
        }
    }
}

const edit = async (req, res) => {
    const { id } = req.params
    try {
        const nameValidator = !validator.isEmpty(req.body.name.trim()) && validator.isLength(req.body.name.trim(), { min: 3, max: 35 });
        if (!nameValidator) {
            return res.status(400).json({
                status: "error",
                mensaje: "No ha pasado las validaciones de campos"
            })
        }
        let filename = ''
        let path = ''
        if (req.file !== undefined) {
            const userFormer = await User.findById(id)
            if (userFormer.photo.path !== '') {
                const path = userFormer.photo.path;
                fs.unlink(path, (err) => {
                    if (err) {
                        return res.status(500).json({ message: 'Internal server error' });
                    }
                });
            }
            filename = req.file.filename
            path = req.file.path
        }

        const user = {
            name: req.body.name,
            filename,
            path
        }

        const userEdited = await User.findByIdAndUpdate(id, user, { new: true, runValidators: true })
        return res.status(200).json({
            message: 'ok',
            userEdited
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            message: 'Internal server error'
        })
    }
}

module.exports = {
    register,
    login,
    edit
}