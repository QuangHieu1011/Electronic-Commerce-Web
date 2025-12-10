const paypal = require('@paypal/checkout-server-sdk')

// PayPal Environment - Sandbox
function environment() {
    // PayPal Sandbox Test Credentials - KHÔNG TRỪ TIỀN THẬT
    let clientId = 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R'
    let clientSecret = 'EHbLA1CTXsEn7e1HVFrGXgmLa7tGJa1gECavhZ1qzYj2P3uobpzwA2zd8AsJRqfyuK6T8P3T7I7aNhaJJ'

    return new paypal.core.SandboxEnvironment(clientId, clientSecret)
}

// PayPal Client
function client() {
    return new paypal.core.PayPalHttpClient(environment())
}

class PayPalController {
    // Tạo PayPal order
    async createOrder(req, res) {
        try {
            const { amount, currency = 'USD', orderId } = req.body

            const request = new paypal.orders.OrdersCreateRequest()
            request.prefer('return=representation')
            request.requestBody({
                intent: 'CAPTURE',
                purchase_units: [{
                    reference_id: orderId,
                    amount: {
                        currency_code: currency,
                        value: amount
                    },
                    description: `Order #${orderId}`
                }],
                application_context: {
                    return_url: 'https://electronic-commerce-web.vercel.app/payment-success',
                    cancel_url: 'https://electronic-commerce-web.vercel.app/checkout',
                    brand_name: 'Your Store Name',
                    landing_page: 'BILLING',
                    user_action: 'PAY_NOW'
                }
            })

            const order = await client().execute(request)

            res.status(200).json({
                success: true,
                orderID: order.result.id,
                order: order.result
            })

        } catch (error) {
            console.error('Create PayPal order error:', error)
            res.status(500).json({
                success: false,
                message: 'Không thể tạo PayPal order',
                error: error.message
            })
        }
    }

    // Capture PayPal payment
    async captureOrder(req, res) {
        try {
            const { orderID } = req.body

            const request = new paypal.orders.OrdersCaptureRequest(orderID)
            request.requestBody({})

            const capture = await client().execute(request)

            res.status(200).json({
                success: true,
                captureID: capture.result.id,
                capture: capture.result
            })

        } catch (error) {
            console.error('Capture PayPal payment error:', error)
            res.status(500).json({
                success: false,
                message: 'Không thể xử lý thanh toán PayPal',
                error: error.message
            })
        }
    }

    // Verify PayPal payment
    async verifyPayment(req, res) {
        try {
            const { orderID, paymentID } = req.body

            const request = new paypal.orders.OrdersGetRequest(orderID)
            const order = await client().execute(request)

            // Kiểm tra trạng thái thanh toán
            if (order.result.status === 'COMPLETED') {
                res.status(200).json({
                    success: true,
                    verified: true,
                    order: order.result
                })
            } else {
                res.status(400).json({
                    success: false,
                    verified: false,
                    message: 'Payment not completed'
                })
            }

        } catch (error) {
            console.error('Verify PayPal payment error:', error)
            res.status(500).json({
                success: false,
                message: 'Không thể xác thực thanh toán',
                error: error.message
            })
        }
    }

    // Get PayPal client token for advanced integrations
    async getClientToken(req, res) {
        try {
            res.status(200).json({
                success: true,
                clientId: 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8aqX3PiV8e1GWU6liB2CUXlkA59kJXE7M6R' // SANDBOX TEST
            })
        } catch (error) {
            console.error('Get PayPal client token error:', error)
            res.status(500).json({
                success: false,
                message: 'Không thể lấy PayPal client token',
                error: error.message
            })
        }
    }
}

module.exports = new PayPalController()