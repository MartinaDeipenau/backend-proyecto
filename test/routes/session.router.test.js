import { expect } from "chai";
import supertest from "supertest";
import { deleteUser } from '../../src/persistencia/DAOs/mongoDAO/userMongo.js'
import { request } from "express";

const requester = supertest('http://localhost:4000')

let cookie

describe('Test Routes Sessions', () => {
    after(async () => {
        await deleteUser({ email: 'lola@sof' })
    })

    it('[POST] /api/register Registrarse exitosamente', async () => {
        const mockUser = {
            first_name: 'Lola',
            last_name: 'Sof',
            email: 'lola@sof',
            age: 18,
            password: 'lola12345'
        }
        const response = await requester.post('/api/register').send(mockUser)
        expect(response.statusCode).to.be.eql(302)
    })

    it('[POST] /api/session/login Iniciar sesión exitosamente', async () => {
        const mockUserLogin = {
            email: 'lola@sof',
            password: 'lola12345'
        }
        const response = await requester.post('/api/session/login').send(mockUserLogin)
        const cookieHeaders = response.headers['set-cookie'][0]
        cookie = {
            name: cookieHeaders.split('=')[0],
            value: cookieHeaders.split('=')[1]
        }
        expect(cookieHeaders).to.be.ok
        expect(cookie.name).to.equal('myCookie')
        expect(cookie.value).to.ok
    })

    it('[GET] /api/session/current Sesión acutal', async () => {
        const response = await requester.get('/api/session/current').set('Cookie', [`${cookie.name}=${cookie.value}`])
        console.log(response.body.payload.user)
        expect(response.body.payload.user.email).to.be.eql('lola@sof')
    })
})