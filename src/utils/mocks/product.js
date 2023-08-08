import {faker} from '@faker-js/faker';

export const generateProduct = () => ({
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName() ,
    description: faker.lorem.paragraph() ,
    code: faker.string.alphanumeric() ,
    price: parseFloat(faker.commerce.price()) ,
    status: true ,
    stock: parseInt(faker.string.numeric()) ,
    category: faker.commerce.department() ,
    thumbnails: [],
});