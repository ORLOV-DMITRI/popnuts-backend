const {prisma} = require("../../prisma/prisma-client");



/**
 * @route GET api/total/
 * @desc ПОлучение доступных средств
 * @access Private
 */
const available = async (req, res) => {
    const userId = req.user.id;

    const totalIncome = await getTotalIncome(userId);
    const totalExpenses = await getTotalExpenses(userId);
    const totalDeposits = await getTotalDeposits(userId);

    const availableMoney = totalIncome - totalExpenses - totalDeposits;

    res.json({ availableMoney });
};

async function getTotalIncome(userId) {
    const result = await prisma.income.aggregate({
        where: {
            userId: userId,
        },
        _sum: {
            sum: true,
        },
    });
    return result._sum.sum || 0; // Возвращает общую сумму доходов или 0, если доходов нет
}
async function getTotalExpenses(userId) {
    const result = await prisma.cost.aggregate({
        where: {
            userId: userId,
        },
        _sum: {
            sum: true,
        },
    });
    return result._sum.sum || 0; // Возвращает общую сумму расходов или 0, если расходов нет
}
async function getTotalDeposits(userId) {
    const result = await prisma.deposit.aggregate({
        where: {
            userId: userId,
        },
        _sum: {
            sum: true,
        },
    });
    return result._sum.sum || 0; // Возвращает общую сумму в конвертах или 0, если конвертов нет
}
module.exports = {
    available
};