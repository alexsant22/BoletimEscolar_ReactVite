import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [students, setStudents] = useState([])
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({
    nome: '',
    n1: '',
    n2: '',
    n3: ''
  })

  // Carregar dados do localStorage ao inicializar
  useEffect(() => {
    const storedStudents = JSON.parse(localStorage.getItem('students')) || []
    setStudents(storedStudents)
  }, [])

  // Salvar dados no localStorage sempre que students mudar
  useEffect(() => {
    localStorage.setItem('students', JSON.stringify(students))
  }, [students])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleAddStudent = () => {
    if (!formData.nome) {
      alert('Por favor, insira o nome do aluno.')
      return
    }

    const newStudent = {
      id: Date.now(),
      nome: formData.nome,
      n1: parseFloat(formData.n1) || 0,
      n2: parseFloat(formData.n2) || 0,
      n3: parseFloat(formData.n3) || 0
    }

    setStudents([...students, newStudent])
    resetForm()
  }

  const handleEditStudent = () => {
    if (!formData.nome) {
      alert('Por favor, insira o nome do aluno.')
      return
    }

    const updatedStudents = students.map(student => {
      if (student.id === editingId) {
        return {
          ...student,
          nome: formData.nome,
          n1: parseFloat(formData.n1) || 0,
          n2: parseFloat(formData.n2) || 0,
          n3: parseFloat(formData.n3) || 0
        }
      }
      return student
    })

    setStudents(updatedStudents)
    setEditingId(null)
    resetForm()
  }

  const startEditing = (student) => {
    setEditingId(student.id)
    setFormData({
      nome: student.nome,
      n1: student.n1,
      n2: student.n2,
      n3: student.n3
    })
  }

  const cancelEditing = () => {
    setEditingId(null)
    resetForm()
  }

  const handleDeleteStudent = (id) => {
    if (window.confirm('Tem certeza que deseja remover este aluno?')) {
      setStudents(students.filter(student => student.id !== id))
    }
  }

  const resetForm = () => {
    setFormData({
      nome: '',
      n1: '',
      n2: '',
      n3: ''
    })
  }

  const calculateAverage = (student) => {
    return ((student.n1 + student.n2 + student.n3) / 3).toFixed(1)
  }

  const getSituation = (student) => {
    const average = calculateAverage(student)
    return average >= 7 ? 'Aprovado' : 'Reprovado'
  }

  return (
    <div className="app dark-theme">
      <div className="header text-center">
        <h1><i className="bi bi-journal-bookmark-fill"></i> Sistema de Boletim Escolar</h1>
        <p className="lead">Gerencie as notas e situações dos alunos</p>
      </div>

      <div className="page-container">
        <div className="card">
          <div className="card-header">
            {editingId ? 'Editar Aluno' : 'Adicionar Novo Aluno'}
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-5">
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">Nome do Aluno</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nome"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    placeholder="Digite o nome do aluno"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label htmlFor="n1" className="form-label">Nota N1</label>
                  <input
                    type="number"
                    className="form-control"
                    id="n1"
                    name="n1"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.n1}
                    onChange={handleInputChange}
                    placeholder="0.0"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label htmlFor="n2" className="form-label">Nota N2</label>
                  <input
                    type="number"
                    className="form-control"
                    id="n2"
                    name="n2"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.n2}
                    onChange={handleInputChange}
                    placeholder="0.0"
                  />
                </div>
              </div>
              <div className="col-md-2">
                <div className="mb-3">
                  <label htmlFor="n3" className="form-label">Nota N3</label>
                  <input
                    type="number"
                    className="form-control"
                    id="n3"
                    name="n3"
                    min="0"
                    max="10"
                    step="0.1"
                    value={formData.n3}
                    onChange={handleInputChange}
                    placeholder="0.0"
                  />
                </div>
              </div>
              <div className="col-md-1 d-flex align-items-end">
                <div className="mb-3">
                  {editingId ? (
                    <>
                      <button className="btn btn-success me-2" onClick={handleEditStudent}>
                        <i className="bi bi-check-lg"></i> Salvar
                      </button>
                      <button className="btn btn-secondary" onClick={cancelEditing}>
                        <i className="bi bi-x-lg"></i> Cancelar
                      </button>
                    </>
                  ) : (
                    <button className="btn btn-primary" onClick={handleAddStudent}>
                      <i className="bi bi-plus-lg"></i> Adicionar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <span>Lista de Alunos</span>
            <span className="badge bg-primary">{students.length} aluno(s) cadastrado(s)</span>
          </div>
          <div className="card-body">
            {students.length === 0 ? (
              <div className="text-center py-4">
                <i className="bi bi-people" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                <p className="mt-3 text-muted">Nenhum aluno cadastrado. Adicione um novo aluno acima.</p>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-striped table-hover">
                  <thead>
                    <tr>
                      <th>Nome do Aluno</th>
                      <th className="text-center">N1</th>
                      <th className="text-center">N2</th>
                      <th className="text-center">N3</th>
                      <th className="text-center">Média</th>
                      <th className="text-center">Situação</th>
                      <th className="text-center">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map(student => (
                      <tr key={student.id}>
                        <td>{student.nome}</td>
                        <td className="text-center">{student.n1.toFixed(1)}</td>
                        <td className="text-center">{student.n2.toFixed(1)}</td>
                        <td className="text-center">{student.n3.toFixed(1)}</td>
                        <td className="text-center fw-bold">{calculateAverage(student)}</td>
                        <td className={`text-center ${getSituation(student) === 'Aprovado' ? 'aprovado' : 'reprovado'}`}>
                          {getSituation(student)}
                        </td>
                        <td className="text-center action-buttons">
                          <button
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => startEditing(student)}
                          >
                            <i className="bi bi-pencil"></i> Editar
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteStudent(student.id)}
                          >
                            <i className="bi bi-trash"></i> Remover
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="alert alert-dark mt-4">
          <h5><i className="bi bi-info-circle"></i> Informações</h5>
          <p className="mb-0">Os dados são armazenados localmente no seu navegador através do localStorage.</p>
        </div>
      </div>
    </div>
  )
}

export default App