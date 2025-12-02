import stripe from 'stripe';
import dotenv from 'dotenv';

dotenv.config();

const stripeClient = stripe(process.env.STRIPE_SECRET_KEY);

export async function createCheckoutSession(cartItems, total, success_url, cancel_url) {
    const line_items = cartItems.map(item => {
        return {
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.product.name,
                },
                unit_amount: Math.round(parseFloat(item.product.price) * 100),
            },
            quantity: item.quantity,
        };
    });

const session = await stripeClient.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        mode: 'payment',
        success_url: success_url,
        cancel_url: cancel_url
    });

    return session;
}
