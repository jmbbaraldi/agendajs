const Contato = require('../models/ContatoModel');

const index = (req, res) => {
    res.render('contato', {contato : {}});
}

const register = async (req, res) => {
    try {
        const contato = new Contato(req.body);
        await contato.register();
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                res.redirect('/contato/index');
            })
            return;
        }
    
        req.flash('success', 'Contato registrado com sucesso.');
        req.session.save(() => {
            res.redirect(`/contato/index/${contato.contato._id}`);
        });
        return;
    }
    catch(e) {
        console.log(e);
        return res.render('404');
    }
};

const editIndex = async (req, res) => {
    if(!req.params.id) return res.render('404');
    
    const contato = await Contato.buscaPorId(req.params.id);
    if(!contato) return res.render('404');

    res.render('contato', { contato });
};

const edit = async (req, res) => {
    try {
        if(!req.params.id) return res.render('404');
    
        const contato = new Contato(req.body)
        await contato.edit(req.params.id);
        if(contato.errors.length > 0) {
            req.flash('errors', contato.errors);
            req.session.save(() => {
                res.redirect('/contato/index');
            })
            return;
        }
    
        req.flash('success', 'Contato editado com sucesso.');
        req.session.save(() => {
            res.redirect(`/contato/index/${contato.contato._id}`);
        });
        return;
    }
    catch(e) {
        console.log(e);
        return res.render('404');
    }
};

const deleteContato = async (req, res) => {
    if(!req.params.id) return res.render('404');
    
    const contato = await Contato.delete(req.params.id);
    if(!contato) return res.render('404');

    req.flash('success', 'Contato deletado com sucesso.');
    req.session.save(() => {
        res.redirect('back');
    });

};

module.exports = {
    index,
    register,
    editIndex,
    edit,
    deleteContato,
}