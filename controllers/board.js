const {prisma} = require("../prisma/prisma-client");

/**
 * @route GET api/board/:workSpaceId
 * @desc ПОлучение всех досок одного пространства
 * @access Private
 */
const all = async (req, res) => {
    try {
        const {workSpaceId} = req.params;
        console.log(workSpaceId)
        if (!workSpaceId) {
            return res.status(400).json({message: "Не найдено рабочее пространство"});
        }
        const boards = await prisma.board.findMany({
            where: {
                workSpaceId
            },
            orderBy: {
                createdAd: 'desc'
            }
        });
        res.status(200).json(boards);
    } catch (error) {
        res.status(400).json({message: "Не удалось получить / " + error.message});
    }
};


/**
 * @route GET api/board/add
 * @desc Создание доски
 * @access Private
 */
const add = async (req, res) => {
    try {
        const {name, workSpaceId} = req.body;
        if (!name) {
            return res.status(400).json({message: "Имя обязательно"});
        }
        if (!workSpaceId) {
            return res.status(400).json({message: "Не найдено рабочее пространство"});
        }
        const newBoard = await prisma.board.create({
            data: {
                name,
                workSpaceId,
            }
        });
        return res.status(201).json(newBoard);
    } catch (error) {
        return res.status(500).json({message: "Ошибка: " + error.message});
    }
};
/**
 * @route DELETE api/board/remove/
 * @desc Удаление доски по id
 * @access Private
 */
const remove = async (req, res) => {
    const {id} = req.body;

    if (!id) {
        return res.status(400).json({message: "id нету"});
    }
    try {
        await prisma.board.delete({where: {id}});
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};

/**
 * @route PUT api/board/edit/
 * @desc Редактирование рабочего пространства по id
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;
    console.log(data)
    if (!id) {
        return res.status(400).json({message: "id нету"});
    }
    try {
        const board = await prisma.board.update({where: {id}, data: {...data}});
        return res.status(204).json(board);
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
