const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET api/cart/
 * @desc Получение всех товаров в корзине для пользователя
 * @access Private
 */
const getAllCartItems = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartItems = await prisma.cartProduct.findMany({
            where: {
                userId: userId
            },
        });
        res.status(200).json(cartItems);
    } catch (error) {
        res.status(400).json({ message: "Не удалось получить корзину: " + error.message });
    }
};
/**
 * @route POST api/cart/add
 * @desc Добавление товара в корзину
 * @access Private
 */
const addToCart = async (req, res) => {
    const {productId, title, price, discountPercentage, rating, brand, stock, thumbnail, category} = req.body;
    const userId = req.user.id;
    
    try {
        const existingCartItem = await prisma.cartProduct.findUnique({
            where: {
                productId_userId: {productId, userId},
            },
        });
        
        if (existingCartItem) {
            // Если товар уже в корзине, увеличиваем количество
            const updatedCartItem = await prisma.cartProduct.update({
                where: {
                    productId_userId: {productId, userId},
                },
                data: {
                    count: existingCartItem.count + 1,
                },
            });
            return res.status(200).json(updatedCartItem);
        } else {
            // Если товара нет в корзине, добавляем его
            const newCartItem = await prisma.cartProduct.create({
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
                    category,
                    count: 1, // Начальное количество — 1
                },
            });
            return res.status(201).json(newCartItem);
        }
    }
    catch (error) {
        res.status(400).json({message: "Не удалось добавить товар: " + error.message});
    }
}
/**
 * @route POST api/cart/remove
 * @desc Уменьшение количества товара в корзине на 1 или удаление, если количество становится 0
 * @access Private
 */
const removeFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;
    
    try {
        const existingCartItem = await prisma.cartProduct.findUnique({
            where: {
                productId_userId: { productId, userId },
            },
        });
        
        if (!existingCartItem) {
            return res.status(404).json({ message: "Товар не найден в корзине" });
        }
        
        if (existingCartItem.count > 1) {
            // Если количество товара больше 1, уменьшаем его на 1
            const updatedCartItem = await prisma.cartProduct.update({
                where: {
                    productId_userId: { productId, userId },
                },
                data: {
                    count: existingCartItem.count - 1,
                },
            });
            return res.status(200).json(updatedCartItem);
        } else {
            // Если количество товара равно 1, удаляем его из корзины
            await prisma.cartProduct.delete({
                where: {
                    productId_userId: { productId, userId },
                },
            });
            return res.status(200).json({ message: "Товар удален из корзины" });
        }
    } catch (error) {
        res.status(400).json({ message: "Не удалось удалить товар: " + error.message });
    }
};

/**
 * @route POST api/cart/remove-item
 * @desc Полное удаление товара из корзины
 * @access Private
 */
const removeItemFromCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user.id;
    
    try {
        const existingCartItem = await prisma.cartProduct.findUnique({
            where: {
                productId_userId: { productId, userId },
            },
        });
        
        if (!existingCartItem) {
            return res.status(404).json({ message: "Товар не найден в корзине" });
        }
        
        // Полное удаление товара из корзины
        await prisma.cartProduct.delete({
            where: {
                productId_userId: { productId, userId },
            },
        });
        
        return res.status(200).json({ message: "Товар успешно удален из корзины" });
    } catch (error) {
        res.status(400).json({ message: "Не удалось удалить товар: " + error.message });
    }
};

module.exports = {
    getAllCartItems,
    addToCart,
    removeFromCart,
    removeItemFromCart
};
