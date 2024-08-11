const { prisma } = require("../prisma/prisma-client");

/**
 * @route GET api/wallet/
 * @desc Получение валюты по умолчанию и всех кошельков пользователя
 * @access Private
 */
const getUserWallets = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                walletUSD: true,
                walletCoin: true,
                preferredCurrency: true,
            },
        });
        
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: "Не удалось получить информацию о кошельках: " + error.message });
    }
};

/**
 * @route POST api/wallet/spend
 * @desc Уменьшение суммы в кошельке в зависимости от выбранной валюты
 * @access Private
 */
const spendFromWallet = async (req, res) => {
    const { amount } = req.body;
    const userId = req.user.id;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                walletUSD: true,
                walletCoin: true,
                preferredCurrency: true,
            },
        });
        
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        
        if (user.preferredCurrency === "USD") {
            if (user.walletUSD < amount) {
                return res.status(400).json({ message: "Недостаточно средств в USD кошельке" });
            }
            await prisma.user.update({
                where: { id: userId },
                data: { walletUSD: user.walletUSD - amount },
            });
        } else if (user.preferredCurrency === "Coin") {
            if (user.walletCoin < amount) {
                return res.status(400).json({ message: "Недостаточно средств в Coin кошельке" });
            }
            await prisma.user.update({
                where: { id: userId },
                data: { walletCoin: user.walletCoin - amount },
            });
        }
        
        res.status(200).json({ message: "Средства успешно списаны" });
    } catch (error) {
        res.status(400).json({ message: "Не удалось списать средства: " + error.message });
    }
};

/**
 * @route POST api/wallet/deposit
 * @desc Пополнение кошелька
 * @access Private
 */
const depositToWallet = async (req, res) => {
    const { currency, amount } = req.body; // currency: "USD" или "Coin"
    const userId = req.user.id;
    
    try {
        if (currency === "USD") {
            await prisma.user.update({
                where: { id: userId },
                data: { walletUSD: { increment: amount } },
            });
        } else if (currency === "Coin") {
            await prisma.user.update({
                where: { id: userId },
                data: { walletCoin: { increment: amount } },
            });
        } else {
            return res.status(400).json({ message: "Неверный тип валюты" });
        }
        
        res.status(200).json({ message: "Кошелек успешно пополнен" });
    } catch (error) {
        res.status(400).json({ message: "Не удалось пополнить кошелек: " + error.message });
    }
};

/**
 * @route POST api/wallet/convert
 * @desc Конвертация валюты 1:1
 * @access Private
 */
const convertCurrency = async (req, res) => {
    const { fromCurrency, toCurrency, amount } = req.body; // fromCurrency и toCurrency: "USD" или "Coin"
    const userId = req.user.id;
    
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                walletUSD: true,
                walletCoin: true,
            },
        });
        
        if (!user) {
            return res.status(404).json({ message: "Пользователь не найден" });
        }
        
        if (fromCurrency === "USD" && toCurrency === "Coin") {
            if (user.walletUSD < amount) {
                return res.status(400).json({ message: "Insufficient funds in USD wallet" });
            }
            await prisma.user.update({
                where: { id: userId },
                data: {
                    walletUSD: { decrement: amount },
                    walletCoin: { increment: amount },
                },
            });
        } else if (fromCurrency === "Coin" && toCurrency === "USD") {
            if (user.walletCoin < amount) {
                return res.status(400).json({ message: "Недостаточно средств в Coin кошельке" });
            }
            await prisma.user.update({
                where: { id: userId },
                data: {
                    walletCoin: { decrement: amount },
                    walletUSD: { increment: amount },
                },
            });
        } else {
            return res.status(400).json({ message: "Неверные типы валют для конвертации" });
        }
        
        res.status(200).json({ message: "Конвертация успешно выполнена" });
    } catch (error) {
        res.status(400).json({ message: "Не удалось выполнить конвертацию: " + error.message });
    }
};



/**
 * @route POST api/wallet/set-currency
 * @desc Установка валюты по умолчанию
 * @access Private
 */
const setPreferredCurrency = async (req, res) => {
    const { currency } = req.body; // currency: "USD" или "Coin"
    const userId = req.user.id;
    
    try {
        if (!['USD', 'Coin'].includes(currency)) {
            return res.status(400).json({ message: "Неверный тип валюты" });
        }
        
        await prisma.user.update({
            where: { id: userId },
            data: { preferredCurrency: currency },
        });
        
        res.status(200).json({ message: "Валюта по умолчанию успешно изменена" });
    } catch (error) {
        res.status(400).json({ message: "Не удалось изменить валюту по умолчанию: " + error.message });
    }
};


module.exports = {
    getUserWallets,
    spendFromWallet,
    depositToWallet,
    convertCurrency,
    setPreferredCurrency
};
