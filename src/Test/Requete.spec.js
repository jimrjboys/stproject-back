import supertest from 'supertest'
import app from '../../index.js'
// import app from '../src/express'
import userData from '../../userData.json'

let requeteId
const co_annonceId = "60326e5fd7a0d9195cb9c51e"

// test create
describe("POST Requete", () => {
    try {
        let reqDetails

        beforeEach(function () {
            console.log('Creation donnée')
            reqDetails = {
                "touristeId": userData.userId,
                "guideId": userData.userId,
                "annonceId": co_annonceId
            }
        })

        afterEach(function () {
            console.log('requête créer ID : ', requeteId)
        })

        it("creation requete en cours", async done => {
            return supertest(app)
                .post('/request')
                .send(reqDetails)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined()

                    requeteId = res.body._id

                    console.log("POST response body : ", res.body)
                    done()
                })
                .catch(err => {
                    return done(err)
                })
        })
    } catch (err) {
        console.log('Exception : ', err)
    }
})

// get all request by annonceId 
describe("get all request by annonce", () => {
    try {
        beforeEach(function () {
            console.log("Get all request by annonce")
        })

        afterEach(function () {
            console.log("All request retrieved")
        })

        test("GET length request", async done => {
            await supertest(app)
                .get(`/request/allRequest/${co_annonceId}`)
                .expect(200)
                .then(res => {
                    console.log('GET RESPONSE : ', res.body.length)
                    done()
                })
                .catch(err => {
                    console.log("Can't retrieve : ", err)
                })
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// get all request by touristeId
describe("GET all request", () => {
    try {
        beforeEach(() => {
            console.log("Get all request by touristeId and annonceId")
        })

        afterEach(() => {
            console.log("All request by touristeId : ", userData.userId)
        })

        test("GET request output", async done => {
            await supertest(app)
                .get(`/request/allRequestTouriste/${userData.userId}`)
                .expect(200)
                .then(res => {
                    console.log("GET RESPONSE REQUEST BY Touriste: ", res.body.length)
                    done()
                })
                .catch(err => {
                    console.log("Can't retrieve : ", err)
                })
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// accept or reject request
describe("PUT Accept or reject request", () => {
    try {
        let AccRej

        beforeEach(() => {
            console.log("Accept request")

            AccRej = {
                "etatRequete": true
            }
        })

        afterEach(() => {
            console.log("accept has been accept")
        })

        test("Accept request now", async done => {
            console.log('request accept with ID : ', requeteId)

            const response = await supertest(app)
                .put(`/request/${requeteId}`)
                .send(AccRej)
                .expect(200)

            // expect(response.body.updatedAd).toBeDefined()
            console.log("Réponses Modification : ", response.body)
            done()
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// cancel request
describe("PUT cancel request", () => {
    try {
        let newCancel

        beforeEach(() => {
            console.log("Cancel Request")
            newCancel = {
                etatAnnulation: true
            }
        })

        afterEach(() => {
            console.log("Request has been cancel")
        })

        test("Mise à jour etat cancel", async done => {
            console.log("requete mis à jour : ", requeteId)

            const response = await supertest(app)
                .put(`/request/cancelRequest/${requeteId}`)
                .send(newCancel)
                .expect(200)

            // expect(response.body.updatedAd).toBeDefined()
            console.log("Réponses Modification : ", response.body)
            done()
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})
