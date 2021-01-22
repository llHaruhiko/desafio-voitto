import React, { useEffect, useState } from 'react';

// components
import { Table, Button, Popup, Modal, Header, Icon, Form, Select } from 'semantic-ui-react';

//services
import api from '../../services/api';
import ViaCep from 'node-viacep';

// styles
import { Container, InitialText, ContainerCursos, H3 } from './styles';


const Dashboard = () => {
  const [alunos, setAlunos] = useState([]);
  const [currentInfo, setCurrentInfo] = useState({});
  const [listCursos, setListCursos] = useState([]);
  const [listCursosAluno, setListCursosAluno] = useState([]);
  const [cursoSelecionado, setCursoSelecionado] = useState();


  const [currentNameInfo, setCurrentNameInfo] = useState();

  const [modalInfos, setModalInfos] = useState(false);
  const [modalNovoAluno, setModalNovoAluno] = useState(false);
  const [modalCursoAluno, setModalCursoAluno] = useState(false);

// Api externa para CEP
  const viacep = new ViaCep({
    type: 'json'
  })

  useEffect(()=>{
    async function fetchData() {
      getAlunos();
      getCursos();
    }
    fetchData();
  }, []);

// Funções de chamada a api
  async function getAlunos(){
    setAlunos({});
    try{
      const response = await api.get('/alunos');
      setAlunos(response.data);
    } catch {
      alert('Erro de conexão com o servidor');
    }
  }

  async function getCursos(){
    try{
      const response = await api.get('/cursos');
      let objArray = response.data.map( (c) => {
        return { key: c.id ,value: c.id, text: c.nome}
      });
      setListCursos(objArray);
    } catch {
      alert('Erro de conexão com o servidor');
    }
  }

  async function getCursosDoAluno(aluno){
    try{
      const response = await api.post('/cursos-aluno', {id: aluno.id});
      let cursosAluno  = '';
      response.data.forEach( cr => {
        listCursos.forEach( lc => {
          if(cr.id_curso == lc.value){
            cursosAluno = cursosAluno + lc.text + "<br>"
          }
        })
      });
      setListCursosAluno(cursosAluno);
    } catch {
      alert('Erro de conexão com o servidor');
    }
  }

  async function setCepInfos(value){
    const cep = value.replace(/\D/,'');
    if(cep.length <= 8){
      setCurrentInfo({
        ...currentInfo,
        cep: cep,
      });
    }
    if(cep.length == 8 ){
      viacep.zipCod.getZip(cep)
      .then(data => data.text())
      .then(data => {
        const cepInfObj = JSON.parse(data);
        setCurrentInfo({
          ...currentInfo,
          cep: cep,
          cidade: cepInfObj.localidade,
          estado: cepInfObj.uf
        });
      });
    }else{
      return;
    }
  }
// Modals
  const render_modal_info_alunos = () => (
    <Modal open={modalInfos} onClose={()=>setModalInfos(false)} closeIcon>
      <Header content={`Editando informações de ${currentNameInfo}`} />
      <Modal.Content>
        <Form>

          <Form.Group widths='equal'>
            <Form.Input fluid label='Nome' placeholder='Nome' value={currentInfo.nome || ''} onChange={ e => setCurrentInfo({
                ...currentInfo,
                nome: e.target.value,
              })} />
            <Form.Input fluid label='Email' placeholder='Email' value={currentInfo.email || ''} onChange={ e => setCurrentInfo({
                ...currentInfo,
                email: e.target.value,
              })} />
          </Form.Group>

          <Form.Group widths='equal'>
            
            <Form.Input fluid label='CEP' placeholder='CEP' value={currentInfo.cep || ''} onChange={ e => setCepInfos( e.target.value )} />
            <Form.Input fluid label='Cidade' placeholder='Cidade' value={currentInfo.cidade || ''} onChange={ e => setCurrentInfo({
                ...currentInfo,
                cidade: e.target.value,
              })} />
            <Form.Input fluid label='Estado' placeholder='Estado' value={currentInfo.estado || ''} onChange={ e => setCurrentInfo({
                ...currentInfo,
                estado: e.target.value,
              })} />
          </Form.Group>

        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={()=>setModalInfos(false)} color='red'>
          <Icon name='remove' /> Cancelar
        </Button>
        <Button color='green' onClick={ () => update_aluno(currentInfo)}>
          <Icon name='checkmark' /> Salvar
        </Button>
      </Modal.Actions>
    </Modal>
  )

  const render_modal_novo_aluno = () => (
    <Modal open={modalNovoAluno} onClose={ ()=>setModalNovoAluno(false) } closeIcon>
      <Header content={"Informe os dados do novo aluno"} />
      <Modal.Content>
        <Form>

        <Form.Group widths='equal'>
          <Form.Input fluid label='Nome' placeholder='Nome' value={currentInfo.nome || ''} onChange={ e => setCurrentInfo({
              ...currentInfo,
              nome: e.target.value,
            })} />
          <Form.Input fluid label='Email' placeholder='Email' value={currentInfo.email || ''} onChange={ e => setCurrentInfo({
              ...currentInfo,
              email: e.target.value,
            })} />
          </Form.Group>

          <Form.Group widths='equal'>
            
            <Form.Input fluid label='CEP' placeholder='CEP' value={currentInfo.cep || ''} onChange={ e => setCepInfos( e.target.value )} />
            <Form.Input fluid label='Cidade' placeholder='Cidade' value={currentInfo.cidade || ''} onChange={ e => setCurrentInfo({
                ...currentInfo,
                cidade: e.target.value,
              })} />
            <Form.Input fluid label='Estado' placeholder='Estado' value={currentInfo.estado || ''} onChange={ e => setCurrentInfo({
                ...currentInfo,
                estado: e.target.value,
              })} />
          </Form.Group>

        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={()=>setModalNovoAluno(false)} color='red'>
          <Icon name='remove' /> Cancelar
        </Button>
        <Button color='green' onClick={ () => novo_aluno(currentInfo)}>
          <Icon name='checkmark' /> Cadastrar
        </Button>
      </Modal.Actions>
    </Modal>
  )

  const render_modal_curso_aluno = () => (
    <Modal open={modalCursoAluno} onClose={ ()=>setModalCursoAluno(false) } closeIcon>
      <Header content={`Gerenciar cursos do aluno ${currentInfo.nome}`} />
      <Modal.Content>
        <Form>
          <Form.Group widths='equal'>
            <ContainerCursos>
              <H3>Cursos cadastrados</H3>
              <div dangerouslySetInnerHTML={{__html: listCursosAluno}} />
            </ContainerCursos>
            <ContainerCursos>
              <H3>Cadastrar novo curso</H3>
              
              <Select fluid placeholder='Selecione o curso' options={listCursos} onChange={ (e, {value}) => {
                setCursoSelecionado(value)
              }} />
            </ContainerCursos>
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={()=>setModalCursoAluno(false)} color='red'>
          <Icon name='remove' /> Fechar
        </Button>
        <Button color='green' onClick={ () => novo_curso_aluno(currentInfo.id, cursoSelecionado)}>
          <Icon name='checkmark' /> Cadastrar Curso
        </Button>
      </Modal.Actions>
    </Modal>
  )
// Funções de ação Aluno
  async function update_aluno(newInfo){
    try{
      const response = await api.post('/update-aluno', newInfo  );
      if(response.data[0] === 1){
        alert('Dados atualizados');
        getAlunos();
        setModalInfos(false);
      }else{
        alert('Não foi possível atualizar os dados');
      }
    } catch {
      alert('Não foi possível atualizar os dados');
      return;
    }
  }

  async function novo_aluno(novo_aluno){
    try{
      const response = await api.post('/novo-aluno', novo_aluno  );
      if(response.data?.id ){
        alert('Aluno cadastrado com sucesso!');
        getAlunos();
        setModalNovoAluno(false);
      }else{
        alert('Não foi possível cadastrar o aluno');
      }
    } catch {
      alert('Não foi possível cadastrar o aluno');
      return;
    }
  }
  async function delete_aluno(data_aluno){
    try{
      const response = await api.post('/delete-aluno',  {id : data_aluno.id} );
      if(response.data === 1){
        alert('Aluno excluido com sucesso!');
        getAlunos();
      }else{
        alert('Não foi possível excluir os dados');
      }
    } catch {
      alert('Não foi possível excluir os dados');
      return;
    }
  }
  async function novo_curso_aluno(id_aluno, id_curso){
    try{
      const response = await api.post('/novo-curso-aluno',  {id_aluno: id_aluno, id_curso: id_curso} );
      // 
      if(response.data){
        alert('Adicionado com sucesso!');
        getCursosDoAluno(currentInfo);
      }else{
        alert('Não foi possível adicionado o curso');
      }
    } catch {
      alert('Não foi possível  adicionado o curso');
      return;
    }
  }

// Abrir Modals
  function open_info_alunos(data_aluno){
    console.log(data_aluno);
    setCurrentInfo(data_aluno);
    setCurrentNameInfo(data_aluno.nome);
    setModalInfos(true);
  }

  function open_novo_aluno(){
    setCurrentInfo({});
    setModalNovoAluno(true)
  }
  function open_curso_aluno(data_aluno){
    getCursosDoAluno(data_aluno);
    setCurrentInfo(data_aluno);
    setModalCursoAluno(true);
  }

  function render_actions(data_aluno){
    return <center>
      <Popup
        trigger={<Button icon='edit' onClick={ () => open_info_alunos(data_aluno) } />}
        content="Editar informações"
        basic
      />
      <Popup
        trigger={<Button icon='plus' positive onClick={ () => open_curso_aluno(data_aluno) } />}
        content="Adicionar curso para aluno"
        basic
      />
      <Popup
        trigger={<Button icon='close' negative onClick={ () => delete_aluno(data_aluno) }  />}
        content="Excluir aluno"
        basic
      />
    </center>
  }

  function render_alunos(){
    return alunos.map((v)=><Table.Row>
      <Table.Cell>{v.id}</Table.Cell>
      <Table.Cell>{v.nome}</Table.Cell>
      <Table.Cell>{v.email}</Table.Cell>
      <Table.Cell>{v.cep}</Table.Cell>
      <Table.Cell>{render_actions(v)}</Table.Cell>
    </Table.Row>)
  }

  return (
    <Container>
      <InitialText>Administrador de alunos</InitialText>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>ID Aluno</Table.HeaderCell>
            <Table.HeaderCell>Nome</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>CEP</Table.HeaderCell>
            <Table.HeaderCell>Ações</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          { alunos.length > 0 ? render_alunos() : <h2>Nenhum dado registrado </h2> }
        </Table.Body>
      </Table>
      {render_modal_info_alunos()}
      {render_modal_novo_aluno()}
      {render_modal_curso_aluno()}
      <Button primary onClick={ () => open_novo_aluno() }>Adicionar aluno</Button>
      <Button href="/" secondary>Ver instruções</Button>
    </Container>
  );
};

export default Dashboard;
