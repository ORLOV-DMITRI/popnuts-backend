const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
    getUserWallets,
    spendFromWallet,
    depositToWallet,
    convertCurrency,
    setPreferredCurrency
} = require("../controllers/wallet");

///api/wallet/
router.get("/", auth, getUserWallets);
router.post("/spend", auth, spendFromWallet);
router.post("/deposit", auth, depositToWallet);
router.post("/convert", auth, convertCurrency);
router.post("/set-currency", auth, setPreferredCurrency);

module.exports = router;
