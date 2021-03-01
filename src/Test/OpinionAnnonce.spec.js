import supertest from 'supertest'
import app from '../../server.js'
import userData from '../../userData.json'

let OAId

// create new opinionAnnonce
describe("POST opinionAnnonce", () => {
    try {
        let OADetails

        beforeEach(function () {
            console.log('Input opinionAnnonce details')
            OADetails = {
                "note": 5,
                "avis": "Super itinéraire",
                "auteurId": userData.userId,
                "annonceId": "60326e5fd7a0d9195cb9c51e",
            }
        })

        afterEach(function () {
            console.log('opinion Annonce create with ID : ', OAId)
        })

        it("Create opinion Annonce data", async done => {
            return supertest(app)
                .post('/opinionAnnonce')
                .send(OADetails)
                .expect('Content-Type', /json/)
                .expect(200)
                .then(res => {
                    expect(res.body).toBeDefined()

                    OAId = res.body._id

                    // let json = JSON.stringify({"OAId": OAId})
                    // fs.writeFile("OAPostGet.json", json, 'utf8', function(err){
                    //     if(err) return console.log(err)

                    //     console.log("POST response body : ", res.body)
                    //     done()
                    // })
                    console.log("POST response body : ", res.body)
                    done()
                })
                .catch(err => {
                    return done(err)
                })
        })

    } catch (err) {
        console.log("Exception : ", err)
    }
})

// get all opinnion Annonce
describe("get all opinion Annonce details", () => {
    try {
        beforeEach(function () {
            console.log("GET all opinionAnnonce details")
        })

        afterEach(function () {
            console.log("All opinionAnnonce are retrieved")
        })

        test("GET opinion output", async done => {
            await supertest(app)
<<<<<<< HEAD
                .get('/opinionAnnonce/60326e5fd7a0d9195cb9c51e')
=======
                .get('/opinionAnnonce/602b9adbb75f4a0d00bf4385')
>>>>>>> 1c77ecc504dea03b17a837c738ba0ef186f10d1f
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

// edit opinion annonce
describe("PUT modification opinion annonce", () => {
    try {
        let newDetails

        beforeEach(function () {

            console.log("Donnée de modification : ")

            newDetails = {
                "note": 5,
                "avis": "très bien modifier",
                "auteurId": userData.userId,
                "annonceId": "602b9adbb75f4a0d00bf4385",
            }
        })

        afterEach(function () {
            console.log('opinion annonce a été modifié')
        })

        test("Mise à jour", async done => {
            console.log("opinion annonce mis à jour : ", OAId)

            const response = await supertest(app)
                .put(`/opinionAnnonce/${OAId}`)
                .send(newDetails)
                .expect(200)

            expect(response.body.updatedAt).toBeDefined()
            console.log("Réponses Modification : ", response.body)
            done()
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// soft delete opinion annonce
describe("DELETE opinion annonce", () => {

    try {
        let softDelete

        beforeEach(function () {
            console.log("softDelete en action")

            softDelete = {
                "etatSuppr": true
            }
        })

        test("SoftDelete", async done => {
            console.log("softDelete de : ", OAId)

            const response = await supertest(app)
                .put(`/opinionAnnonce/${OAId}`)
                .send(softDelete)
                .expect(200)

            console.log("softDelete : ", response.body)
            done()
        })

        afterAll(function () {
            console.log("opinion annonce deleted softly")
        })
    } catch (err) {
        console.log("Exeption : ", err)
    }
})
