const Login = require('../models/LoginModel');

const index = (req, res) => {
    if(req.session.user) return res.render('login-logado')
    return res.render('login');
}

const register = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.register();
    
        if(login.errors.length > 0) {
            req.flash('registerErrors', login.errors);
            req.session.save(function() {
                return res.redirect('/login/index');
            });
            return;
        }
        
        req.flash('success', 'Seu usuário foi criado com sucesso.');
        req.session.save(function() {
            return res.redirect(req.get('Referrer') || '/login/index');
        });
        return;
    }
    catch(e) {
        console.log(e);
        return res.render('404');
    }

}

const login = async (req, res) => {
    try {
        const login = new Login(req.body);
        await login.login();
    
        if(login.errors.length > 0) {
            req.flash('loginErrors', login.errors);
            req.session.save(function() {
                return res.redirect(req.get('Referrer') || '/login/index');
            });
            return;
        }
        
        req.flash('success', 'Você entrou no sistema.');
        req.session.user = login.user;
        req.session.save(function() {
            return res.redirect('/login/index');
        });
        return;
    }
    catch(e) {
        console.log(e);
        return res.render('404');
    }

}

const logout = (req, res) => {
    req.session.destroy();
    res.redirect('/');
}


module.exports = {
    index,
    register,
    login,
    logout,
}