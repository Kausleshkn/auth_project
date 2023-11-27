import userModel from "../models/userModel.js";
import CryptoJS from 'crypto-js';
import jwt from 'jsonwebtoken'

const secret_key = 'jhcsv544vsdbjksd54CAHVSC'
const jwt_secret_key = 'wfeykgvywefv64weyuJVCHsdh46'

class webUser {

    static homePage = async (req, res) => {
        res.render('home')
    }

    static loginPage = async (req, res) => {
        res.render('login')
    }

    static userLogin = async (req, res) => {

        try {
            req.session.userId = req.body.pwd;
            const saved_user = await userModel.findOne({ email:req.body.email })

            if (saved_user != null) {
                // Genrating JWT token
                const token = jwt.sign({ userID: saved_user._id }, jwt_secret_key)
                // Set the JWT as a cookie
                res.cookie('token', token, { httpOnly: true });

                const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(req.body), secret_key).toString();
                res.redirect(`/datadashboard?user=${encodeURIComponent(encryptedData)}`)
            } else{
                res.send('Your email is not found in our database, please register ')
            }
        } catch (error) {
            console.log(error);
        }
    }

    static dataDsPage = async (req, res) => {

        try {
            const decryptedBytes = CryptoJS.AES.decrypt(req.query.user, secret_key);
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
            const { email, pwd } = decryptedData;

            const matchData = await userModel.findOne({ email });
            const decryptedpass = CryptoJS.AES.decrypt(matchData.pwd, secret_key);
            const decryptedUserPass = JSON.parse(decryptedpass.toString(CryptoJS.enc.Utf8));
            if (matchData !== null) {
                if (matchData.email === email && decryptedUserPass === pwd) {
                    res.render('dspage', { matchData })
                } else {
                    res.send('<p>Either email or password is incorrect </p>')
                }
            } else {
                res.send('<p>You are not a registered user </p>')
            }
        } catch (error) {
            console.log(error);
        }
    }

    static rsPage = async (req, res) => {
        res.render('rs')
    }

    static dsPage = async (req, res) => {
        res.render('dspagemain')
    }

    static submitData = async (req, res) => {

        try {
            const { name, email, pwd, phone, msg } = req.body;
            const encryptedPwd = CryptoJS.AES.encrypt(JSON.stringify(pwd), secret_key).toString();

            const userData = new userModel({ name, email, pwd: encryptedPwd, phone, msg })
            await userData.save();
            res.redirect('/login')
        } catch (error) {
            console.log(error);
        }
    }

    static editUsers = async (req, res) => {
        const referer = req.headers.referer;
        // console.log(referer);
        try {
            const userData = await userModel.findById(req.params.id)
            const decryptedBytes = CryptoJS.AES.decrypt(userData.pwd, secret_key);
            const decryptedData = JSON.parse(decryptedBytes.toString(CryptoJS.enc.Utf8));
            res.render('edit', { userData, decryptedData })
        } catch (error) {
            console.log(error);
        }
    }

    static updateUser = async (req, res) => {

        try {
            if (req.body.signin === 'Update_btn') {
                const { name, email, pwd, phone, msg } = req.body;
                const encryptedPwd = CryptoJS.AES.encrypt(JSON.stringify(pwd), secret_key).toString();

                const userData = { name, email, pwd: encryptedPwd, phone, msg }
                const updateData = await userModel.findByIdAndUpdate(req.params.id, userData)
                res.send('<p>your details are updated, please <a href="/login">Login Here</a> to check it</p>')
            }
            // else if (req.body.signin === 'Ds_btn') {
            //     const matchData = await userModel.findById(req.params.id);
            //     res.render('dspage', { matchData });
            // }
        } catch (error) {
            console.log(error);
        }
    }

    static deleteUser = async (req, res) => {
        try {
            await userModel.findByIdAndDelete(req.params.id)
            res.render('dspagemain')
        } catch (error) {
            console.log(error);
        }
    }

    static logoutUser = async (req, res) => {

        // Clear the JWT cookie
        res.cookie('token', '', { expires: new Date(0) });

        req.session.destroy(err => {
            if (err) {
                console.log(err);
            } else {
                res.render('dspagemain');
            }
        });

    }

}

export default webUser;