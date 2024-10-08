// import { randomBytes } from '@harmony-js/crypto/dist/random';
const { v4: uuidv4 } = require('uuid');

export const uuid = () => {
    // return [randomBytes(4), randomBytes(4), randomBytes(4), randomBytes(4)].join(
    //     '-',
    // );
    return uuidv4();
};

export const sleep = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
};
