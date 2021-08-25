import {
    createAccount,
    deleteAccount,
    retrieveAccount,
    updateAccountStripe,
    createExternalAccount,
    listBankAccounts,
    detailsBankAccount,
    linkAccount,
    paymentIntent
} from '../controllers/StripeController'

const StripeRoute = (app) => {
    // create de compte connecter
    app.post('/createSCA', createAccount)

    app.get('/retrieveSCA/:id', retrieveAccount)

    app.delete('/deleteSCA/:id', deleteAccount)

    // update compte connecter
    app.post('/updateSCA/:id', updateAccountStripe)

    // creation compte pour le payout (bank || card)
    app.post('/createExternalAccount/:id', createExternalAccount)

    app.get('/listBankAccounts/:id', listBankAccounts)

    app.get('/bankAccount/:id/:idBank', detailsBankAccount)

    app.post('/linkAccount/:id', linkAccount)

    app.post('/payment/:id', paymentIntent)

}

export default StripeRoute;