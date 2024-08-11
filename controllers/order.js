const { prisma } = require("../prisma/prisma-client");

/**
 * @route POST api/order/checkout
 * @desc Оформление заказа
 * @access Private
 */
const checkoutOrder = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const cartItems = await prisma.cartProduct.findMany({
            where: { userId },
        });
        
        if (cartItems.length === 0) {
            return res.status(400).json({ message: "Ваша корзина пуста" });
        }
        
        // Подсчитываем общую стоимость корзины
        const totalPrice = cartItems.reduce((total, item) => {
            const discountAmount = item.price * (item.discountPercentage / 100);
            const discountedPrice = item.price - discountAmount;
            return total + discountedPrice * item.count;
        }, 0);
        
        // Получаем информацию о пользователе и проверяем достаточно ли средств
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                walletUSD: true,
                walletCoin: true,
                preferredCurrency: true,
            },
        });
        
        let sufficientFunds = false;
        if (user.preferredCurrency === "USD" && user.walletUSD >= totalPrice) {
            sufficientFunds = true;
            await prisma.user.update({
                where: { id: userId },
                data: { walletUSD: { decrement: totalPrice } },
            });
        } else if (user.preferredCurrency === "Coin" && user.walletCoin >= totalPrice) {
            sufficientFunds = true;
            await prisma.user.update({
                where: { id: userId },
                data: { walletCoin: { decrement: totalPrice } },
            });
        }
        
        if (!sufficientFunds) {
            return res.status(400).json({ message: "Недостаточно средств для оплаты заказа" });
        }
        
        // Создаем запись заказа и его элементов
        const order = await prisma.order.create({
            data: {
                userId,
                totalPrice,
                currency: user.preferredCurrency,
                items: {
                    create: cartItems.map(item => ({
                        productId: item.productId,
                        title: item.title,
                        price: item.price,
                        discountPercentage: item.discountPercentage,
                        rating: item.rating,
                        brand: item.brand,
                        quantity: item.count,
                        thumbnail: item.thumbnail,
                        category: item.category
                    })),
                },
            },
        });
        
        // Очищаем корзину
        await prisma.cartProduct.deleteMany({
            where: { userId },
        });
        
        return res.status(200).json({ message: "Заказ успешно оформлен", order });
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при оформлении заказа: " + error.message });
    }
};

/**
 * @route GET api/order/history
 * @desc Получение истории заказов пользователя
 * @access Private
 */
const getOrderHistory = async (req, res) => {
    const userId = req.user.id;
    
    try {
        const orders = await prisma.order.findMany({
            where: { userId },
            include: {
                items: true, // Включаем элементы заказа
            },
            orderBy: {
                createdAt: 'desc', // Сортировка по дате создания (от новых к старым)
            },
        });
        
        if (orders.length === 0) {
            return res.status(200).json( [] );
        }
        
        return res.status(200).json(orders);
    } catch (error) {
        return res.status(500).json({ message: "Ошибка при получении истории заказов: " + error.message });
    }
};


module.exports = {
    checkoutOrder,
    getOrderHistory
};
