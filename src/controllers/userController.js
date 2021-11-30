import User from "../models/User"
import bcrypt from "bcrypt"

export const getJoin = (req, res) => {

    res.render("join", {pageTitle: "계정생성"});
}

export const postJoin = async (req, res) => {
    const {
        email,
        username,
        password,
        password2,
        name,
        location
    } = req.body;
    const pageTitle = "계정생성"

    const userExists = await User.exists({
        $or: [{
                username
            }, {
                email
            }]
    });

    if (password !== password2) {
        return res
            .status(400)
            .render("join", {pageTitle, errorMessage: "확인 비밀번호랑 서로 다릅니다."});
    }

    if (userExists) {
        return res
            .status(400)
            .render("join", {pageTitle, errorMessage: "존재하는 유저명/이메일"});
    }
    try {
        await User.create({email, username, password, name, location});
    } catch (error) {
        return res
            .status(400)
            .render("join", {
                pageTitle,
                errorMessage: error._message
                    ? error._message
                    : "Internal Server"
            });
    }
    res.redirect("/login");
};

export const getLogin = (req, res) => {
    const {password} = req.body;
    return res.render("login", {pageTitle: "로그인"});
};

export const postLogin = async (req, res) => {
    const {username,password} = req.body;
    const user = await User.findOne({username});
    if(!user){
        res.status(400).render("login",{pageTitle,errorMessage:"존재하지 않는 가입명입니다."});
    }

    const existsPW = await bcrypt.compare(password, user.password);
    if (!existsPW) {
        res.status(400).render("login", {
            pageTitle: "로그인",
            errorMessage: "비밀번호를 확인해주세요."
        })
    }

    req.session.loggedIn = true;
    req.session.user = user;

    return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See User");