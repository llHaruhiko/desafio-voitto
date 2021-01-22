import { Router } from 'express';

/** Controllers */
import AlunosController from '../app/controllers/AlunoController';
import CursoController from '../app/controllers/CursoController';
import CursoAlunoController from '../app/controllers/CursoAlunoController';
/**  * */

const routes = new Router();


// rotas Aluno
routes.get('/alunos', AlunosController.index);
routes.post('/novo-aluno', AlunosController.create);
routes.post('/delete-aluno', AlunosController.delete);
routes.post('/update-aluno', AlunosController.update);

// rotas Curso
routes.get('/cursos', CursoController.index);

// rotas Cursos Aluno
routes.post('/novo-curso-aluno', CursoAlunoController.create);
routes.post('/cursos-aluno', CursoAlunoController.index);


export default routes;
