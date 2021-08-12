import Stripe from 'stripe'

const stripe = new Stripe(process.env.key_test_stripe)

/**
 * crée un compte connecté
 * @param {*} req 
 * @param {*} res 
 * @returns {JSON}
 */
export const createAccount = async (req, res) => {
    try {
        const token = await stripe.tokens.create({
            account: req.body
        })

        let data = {
            "country": "FR",
            "type": "custom",
            "capabilities": {
                "card_payments": {
                    "requested": true
                },
                "transfers": {
                    "requested": true
                }
            },
            "business_profile": {
                "mcc": "7929",
                "url": "https://www.microsoft.com/fr"
            },
        }

        data['account_token'] = token.id

        const account = await stripe.accounts.create(data)
        res.json({
            error: false,
            message: account.id
        })
    } catch (error) {
        return res.json({error:true, message: error.message})
    }
}

export const retrieveAccount = async (req, res) => {
    const idAccount =req.params.id
    try {
        const infoAccount = await stripe.accounts.retrieve(idAccount)
        res.json({
            error: false,
            message: infoAccount
        })
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }
}

export const deleteAccount = async (req, res) => {
    const idAccount = req.params.id
    try {
        const deleted = await stripe.accounts.del(idAccount)
        res.json(deleted)
    } catch (error) {
        return res.json({
            error: true,
            message: error.message
        })
    }

} 

/**
 * 
 * @param {*} req 
 * @param {*} res
 * @param {integer} id clé identification du compte stripe 
 * @returns {JSON}
 */
export const updateAccountStripe = async (req, res) => {
    const idAccount = req.params.id

    try {
        const token = await stripe.tokens.create({
            account: req.body
        })

        const data = {}
        
        data['account_token'] = token.id

        const updateAccount = await stripe.accounts.update(idAccount, data)

        res.json({updated: updateAccount})
    } catch (error) {
        return res.json({error: error.message})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res
 * @param {integer} id clé identification du compte stripe
 * @returns {JSON}
 */
export const createExternalAccount = async (req, res) => {
    const idAccount = req.params.id

    try {
        const extAccount = await stripe.accounts.createExternalAccount(idAccount, {
            external_account: req.body
        })

        return res.json({data: extAccount})
    } catch (error) {
        return res.json({error: error.message})
    }
}

/**
 * Permet de renvoyer l'utilisateur vers le flux de stripe
 * pour les vérifications de document nécéssaire à l'activation du compte
 * @param {*} req 
 * @param {*} res
 * @param {integer} id clé identification du compte stripe  
 * @returns {JSON} url vers le flux
 */
export const linkAccount = async (req, res) => {
    const idAccount = req.params.id

    try {
        const accountLinks = await stripe.accountLinks.create({
            account: idAccount,
            refresh_url: process.env.refresh_url,
            return_url: process.env.return_url,
            type: 'account_onboarding'
        })

        let data = {
            error: false,
            message: accountLinks
        }
        res.json(data)
    } catch (error) {
        return res.json({message: error.message})
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {integer} id clé identification du compte stripe  
 * @returns {JSON} revoie le code secret de confirmation du payement du clien
 */
export const paymentIntent = async (req, res) => {
    const idAccount = req.params.id

    try {
        const amount = req.body.amount
        const fees = req.body.application_fee

        const intent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: amount,
            currency: 'eur',
            application_fee_amount: fees,
            transfer_data: {
                destination: id,
            },
        });
        
        const data = {
            error: false,
            message: intent.client_secret
        }
        res.json(data)
    } catch (error) {
        const data = {
            error: true,
            message: error.message
        }
        return res.json(data)
    }
}
