// const path = require('path');
// const fs = require('fs');
// const jsonServer = require('json-server');
// const jwt = require('jsonwebtoken');
// const server = jsonServer.create();
// const router = jsonServer.router(path.join(__dirname, 'db.json'));
// const middleWares = jsonServer.defaults();
// server.use(jsonServer.bodyParser);
// server.use(middleWares);
// const isAuthenticated = ({email, password}) => {
//     return(getUserDb().users.findIndex(user => user.email == email && user.password == password) != -1)
// }
// const getUserDb = () => {
//     return JSON.parse(fs.readFileSync(path.join(__dirname, 'User.json'), 'UTF-8'))
// }
// const SECRET = '12321JKLSJKLSDFJK23423432';
// const expiresIn = '1h';
// const createToken = payload => {
//     return jwt.sign(payload, SECRET, {expiresIn});
// };

// server.post("/sign", (req, res) => {
//     const {email, password} = req.body;
//     if (isAuthenticated({email, password})) {
//         const user = getUserDb().users.find(u => u.email == email && u.password == password);

//         const {nickname, type} = user;
//         const jwToken = createToken({nickname, type, email});
//         return res.status(200).json(jwToken);
//     } else {
//         const status = 401;
//         const message = "Incorrect Email"
//         return res.status(status).json({status, message})
//     }
// })
// server.post("/register", (req, res) => {
//     const {email, password, nickname, type} = req.body;
//     if (isAuthenticated(email, password)) {
//         const status = 401;
//         const message = 'Email and Password is already Exist';
//         return res.status(status).json({status, message});
//     }
//     fs.readFile(path.join(__dirname, 'user.json'), (err, _data) => {
//         if (err) {
//             const status = 401;
//             const message = err;
//             return res.status(status).json({status, message});
//         }
//         const data = JSON.parse(_data.toString());
//         const last_item_id = data.users[data.users.length - 1].id;
//         data.users.push({
//             id: last_item_id + 1,
//             email,
//             password,
//             nickname,
//             type
//         });
//         fs.writeFile(path.join(__dirname, 'User.json'), JSON.stringify(data), (err, result) => {
//             if (err) {
//                 const status = 401;
//                 const message = err;
//                 res.status(status).json({status, message})
//             }
//         })
//     })
// })

// server.use(router);
// server.listen(3009, () => {
//     console.log('JSON Server is running');
// });


const path = require('path');
const fs = require('fs');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const server = jsonServer.create();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middleWares = jsonServer.defaults();
server.use(jsonServer.bodyParser);
server.use(middleWares);

const getUsersDb = () => {
    return JSON.parse(fs.readFileSync(path.join(__dirname, 'User.json'), 'UTF-8'));
};

const isAuthenticated = ({email, password}) => {
    return(getUsersDb().users.findIndex(user => user.email === email && user.password === password) !== -1);
};

const SECRET = '12321JKLSJKLSDFJK23423432';
const expiresIn = '1h';
const createToken = payload => {
    return jwt.sign(payload, SECRET, {expiresIn});
};

server.post('/sign', (req, res) => {
    const {email, password} = req.body;

    if (isAuthenticated({email, password})) {
        const user = getUsersDb().users.find(u => u.email === email && u.password === password);
        const {nickname, type} = user;
        // jwt
        const jwToken = createToken({nickname, type, email});
        return res.status(200).json(jwToken);
    } else {
        const status = 401;
        const message = 'Incorrect email or password';
        return res.status(status).json({status, message});
    }
});
// server.post('carts',(req,res)=>{

// })
// Register New User
server.post('/register', (req, res) => {
    const {email, password, nickname, type} = req.body;

    // ----- 1 step
    if (isAuthenticated({email, password})) {
        const status = 401;
        const message = 'Email and Password already exist';
        return res.status(status).json({status, message});
    }

    // ----- 2 step
    fs.readFile(path.join(__dirname, 'User.json'), (err, _data) => {
        if (err) {
            const status = 401;
            const message = err;
            return res.status(status).json({status, message});
        }
        // Get current users data
        const data = JSON.parse(_data.toString());
        // Get the id of last user
        const last_item_id = data.users[data.users.length - 1].id;
        // Add new user
        data.users.push({
            id: last_item_id + 1,
            email,
            password,
            nickname,
            type
        }); // add some data
        fs.writeFile(path.join(__dirname, 'users.json'), JSON.stringify(data), (err, result) => { // WRITE
            if (err) {
                const status = 401;
                const message = err;
                res.status(status).json({status, message});
                return;
            }
        });
    });

    // Create token for new user
    const jwToken = createToken({nickname, type, email});
    res.status(200).json(jwToken);
});

server.use(router);
server.listen(3009, () => {
    console.log('JSON Server is running');
});
