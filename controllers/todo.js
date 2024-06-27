const {prisma} = require("../prisma/prisma-client");

/**
 * @route GET api/tod0/
 * @desc ПОлучение всех задач
 * @access Private
 */
const all = async (req, res) => {
    try {
        const {cardId} = req.params;
        if (!cardId) {
            return res.status(400).json({message: "Карточка не найдена"});
        }
        const todos = await prisma.todo.findMany({
            where: {
                cardId
            },
        });
        res.status(200).json(todos);
    } catch (error) {
        res.status(400).json({message: "Не удалось получить" + error});
    }
};


/**
 * @route GET api/tod0/add
 * @desc Создание задачи
 * @access Private
 */
const add = async (req, res) => {
    try {
        const {name, description, cardId} = req.body;
        if (!name) {
            return res.status(400).json({message: "Имя обязательно"});
        }
        if (!cardId) {
            return res.status(400).json({message: "Доска не найдена"});
        }
        const newTodo = await prisma.todo.create({
            data: {
                name,
                description,
                cardId,
            }
        });
        return res.status(201).json(newTodo);
    } catch (error) {
        return res.status(500).json({message: "Ошибка: " + error.message});
    }
};
/**
 * @route DELETE api/tod0/remove/
 * @desc Удаление задачи по id
 * @access Private
 */
const remove = async (req, res) => {
    const {id} = req.body;
    try {
        await prisma.todo.delete({where: {id}});
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};

/**
 * @route PUT api/tod0/edit/:id
 * @desc Редактирование задачи id
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;
    try {
        const card = await prisma.todo.update({where: {id}, data: {...data}});
        return res.status(204).json(card);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};

module.exports = {
    all,
    add,
    remove,
    edit,
};
