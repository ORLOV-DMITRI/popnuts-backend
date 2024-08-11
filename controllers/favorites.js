const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET api/favorites/
 * @desc Получение всех избранных товаров для пользователя
 * @access Private
 */
const getAllFavorites = async (req, res) => {
    try {
        const userId = req.user.id;
        const favorites = await prisma.favoriteProduct.findMany({
            where: {
                userId: userId
            },
        });
        res.status(200).json(favorites);
    } catch (error) {
        res.status(400).json({ message: "Не удалось получить избранное: " + error.message });
    }
};

/**
 * @route POST api/favorites/toggle
 * @desc Добавление товара в избранное или его удаление, если он уже в избранном
 * @access Private
 */
const toggleFavorite = async (req, res) => {
    const { productId, title, price, discountPercentage, rating, brand, stock, thumbnail, category } = req.body;
    const userId = req.user.id;
    
    try {
        const existingFavorite = await prisma.favoriteProduct.findUnique({
            where: {
                productId_userId: { productId, userId },
            },
        });
        
        if (existingFavorite) {
            // Товар уже в избранном, удаляем его
            await prisma.favoriteProduct.delete({
                where: {
                    productId_userId: { productId, userId },
                },
            });
            return res.status(200).json({ message: "Товар удален из избранного" });
        } else {
            // Товара нет в избранном, добавляем его
            const newFavorite = await prisma.favoriteProduct.create({
                data: {
                    productId,
                    title,
                    price,
                    discountPercentage,
                    rating,
                    brand,
                    stock,
                    thumbnail,
                    userId,
                    category
                },
            });
            return res.status(201).json(newFavorite);
        }
    } catch (error) {
        return res.status(500).json({ message: "Ошибка: " + error.message });
    }
};


module.exports = {
    getAllFavorites,
    toggleFavorite,
};
