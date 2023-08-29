import { faker } from '@faker-js/faker'

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        thumbnail: faker.image.urlPicsumPhotos(),
        status: faker.datatype.boolean(),
        category: faker.commerce.department(),
        code: faker.string.uuid(),
        price: faker.commerce.price(),
        //stock: faker.helpers.rangeToNumber({ min: 0, max: 50 })
    }
}