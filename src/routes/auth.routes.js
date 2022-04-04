import { Router } from 'express';
import connection from '../../dbConnection';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import uuid from 'uuid';
import { signupValidation, loginValidation} from '../middleware/auth.utils';

export const router = Router();

router.post('/register', signupValidation, (req, res, next) => {
    //need to make sure usernames are unique so that when logging the select 
    //returns only one result
    let username = req.body.username.toLowerCase();
    let password = req.body.password;
    let email = req.body.email;

    connection.query(
        `SELECT * FROM users WHERE LOWER(email) = LOWER(?);`,[email],
        (err, result) => {
        if (result.length) {
            return res.status(409).send({
            msg: 'This email is already in use!'
        });
        } else {
        // if username is available hash password and store user
        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).send({
                    msg: err
                });
            } else {
            // has hashed pw => add to database
            connection.query(
                    "INSERT INTO users (id, username, email, password, registered) VALUES (?,?,?,?,?)", [uuid.v4(), username, email, hash, new Date()],
                    (err, result) => {
                        if (err){
                            return res.status(400).send({
                                msg: err
                            });
                        }else{
                            return res.status(201).send({
                                msg: 'The user has been registered with us!'
                            });
                        }     
                    }
                );
            }
        });
      }
    }
  );
});
 
router.post('/login', loginValidation, (req, res, next) => {

    //need to make sure usernames are unique so that when logging the select 
    //returns only one result
    let username = req.body.username.toLowerCase();
    let password = req.body.password;

    connection.query(
        `SELECT * FROM users WHERE username = ?;`,[username],
        (err, result) => {

            // user does not exists
            if (err) return res.status(400).send({msg: err});
      
            if (!result.length) {
                return res.status(401).send({
                    msg: 'Username or password is incorrect!'
                });
            }

        bcrypt.compare(password, result[0]['password'],(bErr, bResult)=>{
            
            let dbUsername = result[0].username
            let id = result[0].id

            // wrong password
            if (bErr) {
                return res.status(401).send({
                    msg: 'Username or password is incorrect!'
                });
            }

            if (bResult) {

                const accessToken = jwt.sign(
                    {username: dbUsername, userId: id},
                    process.env.JWT_SECRET,
                    {expiresIn: '10s' }
                );

                const refreshToken = jwt.sign(
                    {username: dbUsername, userId: id},
                    process.env.JWT_SECRET_REFRESH,
                    {expiresIn: '1d' }
                );

                connection.query(
                    `UPDATE users SET last_login = now() WHERE id = ?`,[result[0].id],
                );

                res.cookie("accessToken", accessToken,{
                    maxAge: 300000,
                    httpOnly: true,
                })

                res.cookie("refreshToken", refreshToken,{
                    maxAge: 2629743833,  //1 month
                    httpOnly: true,
                })

                console.log("cookie set")

                res.status(200).send({
                    id: result[0].id,
                    username: result[0].username,
                    email: result[0].email,
                    accessToken,
                    refreshToken,
                    isAuth : true
                });


                //possibly causing issue
                //expecting a response but a redirect isnt a response so response would be null or undefined 
                //causing thing to trip balls

                //res.redirect(301,'http://localhost:3000/')
            }

        })
    })

})

router.delete('/logout', loginValidation, (req, res, next) => {

    res.cookie("accessToken", "",{
        maxAge: 0,
        httpOnly: true,
    })

    res.cookie("refreshToken", "",{
        maxAge: 0,
        httpOnly: true,
    })

    res.status(200).send({
        msg: 'Logged out!'
    });

})

export default router;
