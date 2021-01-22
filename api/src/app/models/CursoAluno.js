import { Model, DataTypes } from 'sequelize';

class CursoAluno extends Model {
  //  TODO
  static init(sequelize) {
    super.init(
      {
        id_pessoa: DataTypes.STRING,
        id_curso: DataTypes.STRING,
      },
      {
        sequelize,
        timestamps: false,
        tableName: 'curso_pessoa'
      }
    );

    return this;
  }
}

export default CursoAluno;
