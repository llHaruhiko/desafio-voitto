import CursoAluno from '../models/CursoAluno';
import Curso from '../models/Curso';

class CursoAlunoController {
  async index(req, res) {
    const cursosAluno = await CursoAluno.findAll({
      where: { id_pessoa: req.body.id }
    });

    let cursosDoAluno = cursosAluno.map( ca => {
      return ca.dataValues;
    })
    
    res.json(cursosDoAluno);
  }

  async read(req, res) {
    // TODO
  }

  async create(req, res) {
    // TODO
    let respNew = await CursoAluno.create({
      id_pessoa: req.body.id_aluno,
      id_curso: req.body.id_curso
    });
    res.json(respNew);
  }

  async update(req, res) {
    // TODO
  }

  async delete(req, res) {
    // TODO
    let resDel = await CursoAluno.destroy({
      where: req.body
    });
    res.json(resDel);
  }
}

export default new CursoAlunoController();
