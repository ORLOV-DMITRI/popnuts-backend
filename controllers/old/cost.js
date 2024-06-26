const {prisma} = require("../../prisma/prisma-client");

/**
 * @route GET api/cost/
 * @desc ПОлучение всех расходов
 * @access Private
 */
const all = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let queryWhere = {
            userId: req.user.id,
        };
        if (startDate && endDate) {
            const startOfDay = new Date(startDate);
            startOfDay.setUTCHours(0, 0, 0, 0); // Устанавливаем начало дня

            const endOfDay = new Date(endDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            queryWhere.date = {
                gte: startOfDay, // Дата начала (включительно)
                lte: endOfDay // Дата окончания (включительно)
            };
        }
        let costList = await prisma.cost.findMany({
            where: queryWhere,
            orderBy: {
                date: 'desc' // Сортировка по убыванию (от новых к старым)
            }
        });

        res.status(200).json(costList);
    } catch (error) {
        res.status(400).json({message: "Не удалось получить" + error});
    }
};
/**
 * @route GET api/cost/add
 * @desc Создание расхода
 * @access Private
 */

const add = async (req, res) => {
    try {
        const {name, sum, date} = req.body;
        if (!name || !sum || !date) {
            return res.status(400).json({message: "Не все поля заполенены"});
        }
        const newCost = await prisma.cost.create({
            data: {
                name,
                sum,
                date: date,
                userId: req.user.id
            }
        });

        return res.status(201).json(newCost);
    } catch (error) {
        return res.status(500).json({message: "Ошибка: " + error.message}); // Добавлено .message для более чистого вывода ошибки
    }
};
/**
 * @route POST api/cost/remove/:id
 * @desc Удаление расхода по id
 * @access Private
 */
const remove = async (req, res) => {
    const {id} = req.params;
    try {
        await prisma.cost.delete({where: {id}});
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route POST api/cost/remove/
 * @desc Удаление нескольких
 * @access Private
 */
const removeMultiple = async (req, res) => {
    const {ids} = req.body; // Предполагается, что ids - это массив идентификаторов
    if (!ids) {
        return res.status(400).json({message: "No ids provided for deletion"});
    }
    try {
        await prisma.cost.deleteMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route PUT api/cost/edit/:id
 * @desc Редактирование расхода по id
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;
    try {
        const cost = await prisma.cost.update({where: {id}, data: {...data}});
        return res.status(204).json(cost);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route GET api/cost/:id
 * @desc Получение расхода по id
 * @access Private
 */

const getById = async (req, res) => {
    const {id} = req.params;
    try {
        const cost = await prisma.cost.findUnique({where: {id}});
        return res.status(200).json(cost);
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
