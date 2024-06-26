const jwt = require('jsonwebtoken');
const {prisma} = require('../prisma/prisma-client')



const auth = async (req, res, next) => {
    try {
        let token = req.headers.authorization?.split(' ')[1];

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await prisma.user.findFirst({
            where: {
                id: decoded.id
            }
        });

        next();
    } catch (error) {
        res.status(400).json({message: 'Не авторизован'})
    }
}

module.exports = {
    auth
}