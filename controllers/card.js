const {prisma} = require("../prisma/prisma-client");

/**
 * @route GET api/card/
 * @desc ПОлучение всех карточек
 * @access Private
 */
const all = async (req, res) => {
    try {
        const {boardId} = req.params;
        if (!boardId) {
            return res.status(400).json({message: "Доска не найдена"});
        }
        const cards = await prisma.card.findMany({
            where: {
                boardId
            },
            include: {
                Todo: true
            }
        });
        res.status(200).json(cards);
    } catch (error) {
        res.status(400).json({message: "Не удалось получить" + error});
    }
};


/**
 * @route GET api/card/add
 * @desc Создание карточки
 * @access Private
 */
const add = async (req, res) => {
    try {
        const {name, boardId} = req.body;
        if (!name) {
            return res.status(400).json({message: "Имя обязательно"});
        }
        if (!boardId) {
            return res.status(400).json({message: "Доска не найдена"});
        }
        const newCard = await prisma.card.create({
            data: {
                name,
                boardId,
            }
        });
        return res.status(201).json(newCard);
    } catch (error) {
        return res.status(500).json({message: "Ошибка: " + error.message});
    }
};
/**
 * @route DELETE api/card/remove/
 * @desc Удаление карточки по id
 * @access Private
 */
const remove = async (req, res) => {
    const {id} = req.body;
    try {
        await prisma.card.delete({where: {id}});
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};

/**
 * @route PUT api/card/edit/:id
 * @desc Редактирование рабочего пространства по id
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;
    try {
        const card = await prisma.card.update({where: {id}, data: {...data}});
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
