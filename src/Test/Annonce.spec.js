import supertest from 'supertest'
import app from '../../index.js'
// import app from '../src/express'
import userData from '../../userData.json'

const annonceId = "60326e40d7a0d9195cb9c51d"

// post annonce
// describe(`POST /annonce/${userData.userId}`, () => {
//     try {
//         let dataAnnonce
//         const filePath = `${__dirname}/imgTest/test.png`

//         beforeEach(() => {
//             console.log("here is data to post")
//             dataAnnonce = {
//                 titre: "Annonce jest",
//                 description: "je test avec jest annnonce",
//                 lieu: "Le lieu est chez moi",
//                 localisationAnnonce: "12.1244.1281.1298",
//                 utilisateurId: userData.userId,
//                 // photoAnnonce: filePath
//             }
//         })

//         afterEach(() => {
//             console.log("Annonce has been created")
//         })

//         it("send annonce info now", async done => {
//             return supertest(app)
//                 .post(`/annonce/${userData.userId}`)
//                 .set('Content-Type', 'application/octet-stream')
//                 .send(dataAnnonce)
//                 // .attach('photoAnnonce', filePath)
//                 .send(dataAnnonce)
//                 .then(res => {
//                     expect(res.body).toBeDefined()
//                     annonceId = res.body._id

//                     console.log("data posted : ", res.body)
//                     done()
//                 })
//                 .catch(err => {
//                     return done(err)
//                 })
//         })
//     } catch (err) {
//         console.log("Exception", err)
//     }
// })

// edit annonce
describe(`PUT /annonce/oneId/${annonceId}`, () => {
    try {
        let newAnnonce

        beforeEach(() => {
            console.log("edit annonce")
            newAnnonce = {
                titre: "Annonce jest en edit",
                description: "je test avec jest annnonce en edit",
                lieu: "Le lieu est chez moi en edition",
                localisationAnnonce: "12.1244.1281.1298",
                utilisateurId: userData.userId,
            }
        })

        afterEach(() => {
            console.log("Annonce has been edited successfully")
        })

        test("Edit annonce now", async done => {
            const response = await supertest(app)
                .put(`/annonce/oneId/${annonceId}`)
                .send(newAnnonce)
                .expect(200)

            console.log("Réponse : ", response.body)
            done()
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// find all annonce
describe("GET /annonce", () => {
    try {
        afterEach(() => {
            console.log("All annonce has been retrieved")
        })

        test("get all annonce now", async done => {
            await supertest(app)
                .get('/annonce')
                .expect(200)
                .then(res => {
                    console.log("here is response : ", res.body.length)
                    done()
                })
                .catch(err => {
                    console.log("can't retrieve annonces : ", err)
                })
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// find all annonce by guide
describe(`GET /annonce/annonceGuide/${userData.userId}`, () => {
    try {
        afterEach(() => {
            console.log("Annonces by guideId have been retrieve")
        })

        test("GET annonces by guideId now", async done => {
            await supertest(app)
                .get(`/annonce/annonceGuide/${userData.userId}`)
                .expect(200)
                .then(res => {
                    console.log("length response is : ", res.body.length)
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

// findOneAnnonce annonce
describe(`GET /annonce/oneId/${annonceId}`, () => {
    try {
        afterEach(() => {
            console.log("Annonce retrieve successfully")
        })

        test("Get one annonce now", async done => {
            await supertest(app)
                .get(`/annonce/${annonceId}`)
                .expect(200)
                .then(res => {
                    console.log("annonce information is : ", res.body.length)
                    done()
                })
                .catch(err => {
                    console.log("can't get one annonce : ", err)
                })
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// softdelete annonce
describe(`PUT /annonce/softDeleteAnnonce/${annonceId}`, () => {
    try {
        let softDel

        beforeEach(() => {
            console.log("prepare data to update")
            softDel = {
                etatSuppr: true
            }
        })

        afterEach(() => {
            console.log("Annonce has been delete softly")
        })

        test("Delete softly now", async done => {
            await supertest(app)
                .put(`/annonce/softDeleteAnnonce/${annonceId}`)
                .send(softDel)
                .expect(200)
                .then(res => {
                    console.log("response for softdelete : ", res.body)
                    done()
                })
                .catch(err => {
                    console.log("can't delete softly : ", err)
                })
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})

// edit annonce State
describe(`PUT /annonce/editStateAnnonce/${annonceId}`, () => {
    try {
        let stateAnnonce
        beforeEach(() => {
            console.log("Prepare new stateAnnonce")
            stateAnnonce = {
                etatReaparaitre: true
            }
        })

        test("Change stateAnnonce now", async done => {
            await supertest(app)
                .put(`/annonce/editStateAnnonce/${annonceId}`)
                .send(stateAnnonce)
                .expect(200)
                .then(res => {
                    console.log("response for change statement : ", res.body)
                    done()
                })
                .catch(err => {
                    console.log("can't change state Annonce : ", err)
                })
        })
    } catch (err) {
        console.log("Exception : ", err)
    }
})
