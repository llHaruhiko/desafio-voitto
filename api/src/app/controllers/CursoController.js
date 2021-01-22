import Curso from '../models/Curso';

class CursoController {
  async index(req, res) {
    const cursos = await Curso.findAll();
    res.json(cursos);
  }

  async read(req, res) {
    // TODO
  }

  async create(req, res) {
    // TODO
  }

  async update(req, res) {
    // TODO
  }

  async delete(req, res) {
    // TODO
  }
}

export default new CursoController();
