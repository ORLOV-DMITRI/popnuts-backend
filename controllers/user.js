const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {prisma} = require('../prisma/prisma-client')


/**
 * @route GET-/api/user/login
 * @desc Регестраци
 * @access Public
 */
const login = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({message: "Заполните поля"});
        }

        const user = await prisma.user.findFirst({
            where: {
                email
            }
        });

        const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));
        const secret = process.env.JWT_SECRET;

        if (user && isPasswordCorrect && secret) {
            res.status(200).json({
                id: user.id,
                email: user.email,
                token: jwt.sign({id: user.id}, secret, {expiresIn: "30d"})
            });
        } else {
            return res.status(400).json({message: "Ошилбка Логина или Парооооля"});
        }
    } catch (error) {
        return res.status(400).json({message: "Что то пошло не так"});
    }
};

const register = async (req, res) => {
    try {
        const {email, password} = req.body;

        if (!email) {
            return res.status(400).json({message: "Email обязательно"});
        }
        if (!password) {
            return res.status(400).json({message: "Пароль обязательно"});
        }

        const registeredUser = await prisma.user.findFirst({
            where: {
                email
            }
        });
        if (registeredUser) {
            return res.status(400).json({message: "Пользователь с таким email уже существует"});
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const user = await prisma.user.create({
            data: {
                email,
                password: hash
            }
        });
        const secret = process.env.JWT_SECRET;

        if (user && secret) {
            res.status(201).json({
                id: user.id,
                email: user.email,
                token: jwt.sign({id: user.id}, secret, {expiresIn: "30d"})
            });
        } else {
            return res.status(400).json({message: "Ошибка создания"});
        }
    } catch (error) {
        return res.status(400).json({message: "ОШИБКА" + error});
    }
};
/**
 *
 * @route GET /api/user/current
 * @desc Текущий пользователь
 * @access Private
 */

const current = async (req, res) => {
    res.status(200).json(req.user);
};


module.exports = {
    login,
    register,
    current
};
