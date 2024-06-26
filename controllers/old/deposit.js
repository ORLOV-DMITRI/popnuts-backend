const {prisma} = require("../../prisma/prisma-client");

/**
 * @route GET api/deposit/
 * @desc ПОлучение всех конвертов
 * @access Private
 */
const all = async (req, res) => {
    try {
        let depositList = await prisma.deposit.findMany({
            where: {
                userId: req.user.id
            }
        });

        res.status(200).json(depositList);
    } catch (error) {
        res.status(400).json({message: "Не удалось получить" + error});
    }
};
/**
 * @route GET api/deposit/add
 * @desc Создание конверта
 * @access Private
 */

const add = async (req, res) => {
    try {
        const {name} = req.body;

        if (!name) {
            return res.status(400).json({message: "Не все поля заполенены"});
        }
        const newDeposit = await prisma.deposit.create({
            data: {
                name,
                sum: 0,
                userId: req.user.id
            }
        });

        return res.status(201).json(newDeposit);
    } catch (error) {
        return res.status(500).json({message: "Ошибка: " + error.message}); // Добавлено .message для более чистого вывода ошибки
    }
};
/**
 * @route POST api/deposit/remove/:id
 * @desc Удаление конверта по id
 * @access Private
 */
const remove = async (req, res) => {
    const {id} = req.params;
    try {
        await prisma.deposit.delete({where: {id}});
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};


/**
 * @route PUT api/deposit/edit/:id
 * @desc Редактирование конверта по id
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;
    try {
        const deposit = await prisma.deposit.update({where: {id}, data: {...data}});
        return res.status(204).json(deposit);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route GET api/deposit/:id
 * @desc Получение конверта по id
 * @access Private
 */

const getById = async (req, res) => {
    const {id} = req.params;
    try {
        const deposit = await prisma.deposit.findUnique({where: {id}});
        return res.status(200).json(deposit);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};

async function getTotalDeposits(req, res) {
    try {
        const result = await prisma.deposit.aggregate({
            where: {
                userId: req.user.id
            },
            _sum: {
                sum: true
            }
        });
        const depositTotal = result._sum.sum || 0;
        res.json({depositTotal});
    } catch (error) {
        return res.status(500).json({message: error});
    }

}

module.exports = {
    all,
    add,
    remove,
    edit,
    getById,
    getTotalDeposits
};
