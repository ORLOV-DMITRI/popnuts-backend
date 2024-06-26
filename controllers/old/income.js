const {prisma} = require("../../prisma/prisma-client");

/**
 * @route GET api/income/
 * @desc ПОлучение всех доходов
 * @access Private
 */
const all = async (req, res) => {
    try {
        const incomeList = await prisma.income.findMany({
            where: {
                userId: req.user.id
            },
            orderBy: {
                date: 'desc' // Сортировка по убыванию (от новых к старым)
            }
        });
        res.status(200).json(incomeList);
    } catch (error) {
        res.status(400).json({message: "Не удалось получить" + error.message});
    }
};
/**
 * @route GET api/income/add
 * @desc Создание дохода
 * @access Private
 */

const add = async (req, res) => {
    try {
        const {name, sum, date} = req.body;
        if (!name || !sum || !date) {
            return res.status(400).json({message: "Не все поля заполенены"});
        }
        const newIncome =  await prisma.income.create({data: {name, sum, date, userId: req.user.id}});
        return res.status(201).json(newIncome);
    } catch (error) {
        return res.status(500).json({message: "Ошибка" + error.message});
    }
};
/**
 * @route POST api/income/remove/:id
 * @desc Удаление дохода по id
 * @access Private
 */
const remove = async (req, res) => {
    const {id} = req.params;
    try {
        await prisma.income.delete({where: {id}});
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route POST api/income/remove/
 * @desc Удаление нескольких
 * @access Private
 */
const removeMultiple  = async (req, res) => {
    const { ids } = req.body; // Предполагается, что ids - это массив идентификаторов
    try {
        await prisma.income.deleteMany({
            where: {
                id: {
                    in: ids
                },
            },
        });
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route PUT api/income/edit/:id
 * @desc Редактирование дохода по id
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;
    try {
        const income = await prisma.income.update({where: {id}, data: {...data}});
        return res.status(204).json(income);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route GET api/income/:id
 * @desc Получение дохода по id
 * @access Private
 */

const getById = async (req, res) => {
    const {id} = req.params;
    try {
        const income = await prisma.income.findUnique({where: {id}});
        return res.status(200).json(income);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
module.exports = {
    all,
    add,
    remove,
    edit,
    getById,
    removeMultiple
};
