const Contato = require('../models/ContatoModel');

const index = async (req, res) => {
  const contatos = await Contato.buscaContato();
  res.render('index', { contatos });
}

module.exports = {
  index, 
}