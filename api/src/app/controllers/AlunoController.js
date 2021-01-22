import Aluno from '../models/Aluno';

class AlunoController {
  async index(req, res) {
    const alunos = await Aluno.findAll()
    res.json(alunos);
  }

  async read(req, res) {
    // TODO
  }

  async create(req, res) {
    // TODO
    let respNew = await Aluno.create(req.body);
    res.json( respNew );
  }

  async update(req, res) {
    // TODO
    let respUpd = await Aluno.update(req.body, {
      where: {id : req.body.id}
    });
    res.json(respUpd);
  }

  async delete(req, res) {
    // TODO
    let resDel = await Aluno.destroy({
      where: { id: req.body.id}
    });
    res.json(resDel);
  }
}

export default new AlunoController();
