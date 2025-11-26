const UserRouter = require('./UserRouter')
const ProductRouter = require('./ProductRouter')
const OrderRouter = require('./OrderRouter')
const PayPalRouter = require('./PayPalRouter')
const OTPRouter = require('./OTPRouter')

const routes = (app) => {
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/order', OrderRouter)
    app.use('/api/paypal', PayPalRouter)
    app.use('/api/otp', OTPRouter)
};


module.exports = routes;