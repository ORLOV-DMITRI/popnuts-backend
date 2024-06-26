const {prisma} = require("../../prisma/prisma-client");

/**
 * @route GET /api/transaction/history/:depositId
 * @desc ПОлучение всех расходов
 * @access Private
 */
const all = async (req, res) => {
    const {depositId} = req.params;
    try {
        const transactions = await prisma.transaction.findMany({
            where: {
                depositId
            },
            orderBy: {
                date: "desc"
            }
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
/**
 * @route GET /api/transaction/add
 * @desc Создание расхода
 * @access Private
 */

const add = async (req, res) => {

    try {
        const {depositId, type, sum} = req.body;

        const transaction = await prisma.transaction.create({
            data: {
                depositId,
                type,
                sum
            }
        });
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};

module.exports = {
    all,
    add

};
