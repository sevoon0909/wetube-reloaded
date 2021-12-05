import User from "../models/User";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

export const getJoin = (req, res) => {
  res.render("join", { pageTitle: "계정생성" });
};

export const postJoin = async (req, res) => {
  const { email, username, password, password2, name, location } = req.body;
  const pageTitle = "계정생성";

  const userExists = await User.exists({
    $or: [
      {
        username,
      },
      {
        email,
      },
    ],
  });

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: "확인 비밀번호랑 서로 다릅니다.",
    });
  }

  if (userExists) {
    return res
      .status(400)
      .render("join", { pageTitle, errorMessage: "존재하는 유저명/이메일" });
  }
  try {
    await User.create({ email, username, password, name, location });
  } catch (error) {
    console.log(error);
    return res.status(400).render("join", {
      pageTitle,
      errorMessage: error._message ? error._message : "Internal Server",
    });
  }
  res.redirect("/login");
};

export const getLogin = (req, res) => {
  const { password } = req.body;
  return res.render("login", { pageTitle: "로그인" });
};

export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOny: false });
  const pageTitle = "로그인";
  if (!user) {
    return res.status(400).render("login", {
      pageTitle,
      errorMessage: "존재하지 않는 가입명입니다.",
    });
  }

  const existsPW = await bcrypt.compare(password, user.password);
  if (!existsPW) {
    return res
      .status(400)
      .render("login", { pageTitle, errorMessage: "비밀번호를 확인해주세요." });
  }

  req.session.loggedIn = true;
  req.session.user = user;
  return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
  const baseUrl = `https://github.com/login/oauth/authorize`;
  const config = {
    client_id: process.env.GH_CLIENT,
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${params}`;
  return res.redirect(finalUrl);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = `https://github.com/login/oauth/access_token`;
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config);
  const finalUrl = `${baseUrl}?${params}`;
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  if ("access_token" in tokenRequest) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    console.log(userData);
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    // console.log(emailData);
    const emailObj = emailData.find(
      (email) => email.primary === true && email.verified === true
    );
    if (!emailObj) {
      return res.redirect("/login");
    }
    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        email: emailObj.email,
        username: userData.login,
        avatarUrl: userData.avatar_url,
        password: "",
        name: userData.name,
        location: userData.location,
        socialOnly: true,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect("/");
  } else {
    return res.redirect("/login");
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const getEdit = (req, res) => {
  res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const { user } = req.session;
  const { username, name, email, location } = req.body;

  const queryParams = [{ username }, { email }];

  const existUser = await User.findOne({
    _id: { $ne: user._id },
    $or: queryParams,
  });

  if (existUser) {
    return res.status(400).render("edit-profile", {
      pageTitle: "Edit Profile",
      errorMessage: "존재하는 유저명/이메일",
    });
  }

  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    {
      name,
      username,
      email,
      location,
    },
    { new: true }
  );
  //option new : true 업데이트이후 기본값은 업데이트 이전값을 돌려준다.
  req.session.user = updatedUser;
  // req.session.user = {
  //   ...req.session.user,
  //   name,
  //   username,
  //   email,
  //   location,
  // }
  res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  if (req.session.user.socialOnly === true) {
    return res.redirect("/");
  }
  return res.render("users/change-password", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  //result password result
  const {user} = req.session;
  const {
    body: { oldPassword, newPassword, newPasswordConfirm },
  } = req;

  const findUser = await User.findById({_id:user._id})
  const existsPW = await bcrypt.compare(oldPassword, findUser.password);
  const pageTitle = "Change Password";
  if (!existsPW) {
    return res
      .status(400)
      .render("users/change-password", { pageTitle, errorMessage: "비밀번호를 확인해주세요." });
  }
  if (newPassword !== newPasswordConfirm) {
    return res.status(400).render("users/change-password", {
      pageTitle,
      errorMessage: "확인 비밀번호가 다릅니다.",
    });
  }

  console.log(user.password);
  findUser.password = newPasswordConfirm;
  await findUser.save();
  console.log(findUser.password);
  console.log(user.password);
  return res.redirect("/users/logout");
};

export const see = (req, res) => res.send("See User");
