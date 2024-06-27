const {prisma} = require("../prisma/prisma-client");

/**
 * @route GET api/space/
 * @desc ПОлучение всех рабочих пространств
 * @access Private
 */
const all = async (req, res) => {
    try {
        if (!req.user.id) {
            return res.status(400).json({message: "Не авторизован"});
        }
        const workSpaces = await prisma.workSpace.findMany({
            where: {
                userId: req.user.id,
            },
            include: {
                Boards: true,
            },
            orderBy: {
                createdAd: 'desc'
            }
        });
        res.status(200).json(workSpaces);
    } catch (error) {
        res.status(400).json({message: "Не удалось получить" + error});
    }
};


/**
 * @route GET api/space/add
 * @desc Создание рабочего пространства
 * @access Private
 */
const add = async (req, res) => {
    try {
        const {name} = req.body;
        if (!name) {
            return res.status(400).json({message: "Имя обязательно"});
        }
        const newWorkSpace = await prisma.workSpace.create({
            data: {
                name,
                userId: req.user.id
            }
        });
        return res.status(201).json(newWorkSpace);
    } catch (error) {
        return res.status(500).json({message: "Ошибка: " + error.message});
    }
};
/**
 * @route DELETE api/space/remove/
 * @desc Удаление рабочего пространства по id
 * @access Private
 */
const remove = async (req, res) => {
    const {id} = req.body;
    try {
        await prisma.workSpace.delete({where: {id}});
        
        return res.status(204).json("OK");
    } catch (error) {
        return res.status(500).json({message: error});
    }
};

/**
 * @route PUT api/space/edit/:id
 * @desc Редактирование рабочего пространства по id
 * @access Private
 */
const edit = async (req, res) => {
    const data = req.body;
    const id = data.id;
    try {
        const workSpace = await prisma.workSpace.update({where: {id}, data: {...data}});
        return res.status(204).json(workSpace);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};
/**
 * @route GET api/space/:id
 * @desc Получение рабочего пространства по id
 * @access Private
 */

const getById = async (req, res) => {
    const {id} = req.params;
    try {
        const workSpace = await prisma.workSpace.findUnique({where: {id}});
        return res.status(200).json(workSpace);
    } catch (error) {
        return res.status(500).json({message: error});
    }
};

module.exports = {
    all,
    add,
    remove,
    edit,
    getById
};
