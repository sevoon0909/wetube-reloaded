export const localsMiddleware = (req,res,next)=>{
    console.log(req.session);
    res.locals.siteName = "Wetube";
    res.locals.loggedIn = Boolean(req.session.loggedIn);

    next();
}