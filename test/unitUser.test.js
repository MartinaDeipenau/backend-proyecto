import '../src/config/configDB.js'
import mongoose from 'mongoose'
import { getUsers } from '../src/persistencia/DAOs/mongoDAO/userMongo.js'
import Assert from 'assert'

const assert = Assert.strict

describe("Testing User DAO", () => {
    beforeEach(async function () {
        this.timeout(5000)
    })

    it('DAO debe agregar un usuario correctamente', async () => {
        const result = await getUsers()
        assert.strictEqual(Array.isArray(result), true)
    })
})