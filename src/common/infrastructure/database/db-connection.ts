require('dotenv').config();

/**
 * DB_CONNECTION string for mongo data base
 * Formatt: mongodb://[username:password@]host1[:port1][,...hostN[:portN]][/[defaultauthdb][?options]]
 */
let DB_CONNECTION: string = '';

if (!process.env.SERVER_BFF_MONGO_USERPASSWORD) throw Error('Env variable SERVER_BFF_MONGO_USERPASSWORD is undefined');

if (process.env.SERVER_BFF_MONGO_ON_SERVER === 'false') {
    //Running in Localhost 
    //Example: mongodb://testadmin:testadmin123@127.0.0.1:27017/?authSource=bdTest
    //Example: mongodb://127.0.0.1:27017/test?readPreference=primary&appname=MongoDB%20Compass&ssl=false
    DB_CONNECTION = `mongodb://`;
    DB_CONNECTION += `${process.env.SERVER_BFF_MONGO_USERNAME}:`;
    //password encoded as a connection string URI
    DB_CONNECTION += `${encodeURIComponent(process.env.SERVER_BFF_MONGO_USERPASSWORD)}@`;
    DB_CONNECTION += `${process.env.SERVER_BFF_MONGO_HOST}/`;
    DB_CONNECTION += `?authSource=${process.env.SERVER_BFF_MONGO_DB}`;
} else {
    //Running in server
    //mongodb+srv://daro:<password>@cluster0.7hvve.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
    //SERVER_BFF_MONGO_HOST="clusterdaro.zjmdi.mongodb.net"
    //SERVER_BFF_MONGO_DB="myFirstDatabase"
    //SERVER_BFF_MONGO_USERNAME="daro"
    //SERVER_BFF_MONGO_USERPASSWORD="Daroandres12345"
    DB_CONNECTION = `mongodb+srv://`;
    DB_CONNECTION += `${process.env.SERVER_BFF_MONGO_USERNAME}:`;
    //password encoded as a connection string URI
    DB_CONNECTION += `${encodeURIComponent(process.env.SERVER_BFF_MONGO_USERPASSWORD)}@`;
    DB_CONNECTION += `${process.env.SERVER_BFF_MONGO_HOST}/`;
    DB_CONNECTION += `${process.env.SERVER_BFF_MONGO_DB}?retryWrites=true&w=majority`;
}


export default DB_CONNECTION;

