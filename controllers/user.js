const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {prisma} = require('../prisma/prisma-client')

const loginOrRegister = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ message: "Заполните все поля" });
        }
        
        let user = await prisma.user.findFirst({ where: { email } });
        
        if (!user) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            
            user = await prisma.user.create({
                data: {
                    email,
                    password: hash
                }
            });
        } else {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            if (!isPasswordCorrect) {
                return res.status(400).json({ message: "There is a user, but the password is incorrect" });
            }
        }
        
        // Создание JWT токена
        const secret = process.env.JWT_SECRET;
        
        if (!secret) {
            return res.status(500).json({ message: "Секретный ключ не установлен" });
        }
        
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: "30d" });
        
        res.status(user ? 200 : 201).json({
            id: user.id,
            email: user.email,
            token
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Что-то пошло не так" });
    }
};

const current = async (req, res) => {
    res.status(200).json(req.user);
};


module.exports = {
    loginOrRegister,
    current
};
