import React, { useState, useEffect } from 'react';
import InputMask from 'react-input-mask';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../axiosconfig'; // Importa a configuração do axios

interface Aluno {
  id: number;
  nome: string;
  cpf: string;
  email: string;
  dt_nascimento: string;
  celular: string;
  apelido?: string;
  matricula: string;
}

const CrudForms = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch alunos from backend
    api.get('/aluno')
      .then(response => {
        setAlunos(response.data.data); // Acesse a propriedade 'data' do objeto de resposta
      })
      .catch(error => {
        console.error('Erro ao buscar alunos:', error);
      });
  }, []);

  const formik = useFormik({
    initialValues: {
      nome: '',
      cpf: '',
      email: '',
      dt_nascimento: '',
      celular: '',
      apelido: '',
      matricula: '',
    },

    validationSchema: Yup.object({
      nome: Yup.string().required('Nome é obrigatório'),
      cpf: Yup.string()
        .matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{3}-[0-9]{2}$/, 'CPF inválido')
        .required('CPF é obrigatório'),
      email: Yup.string().email('Email inválido').required('Email é obrigatório'),
      dt_nascimento: Yup.date().required('Data de Nascimento é obrigatória'),
      celular: Yup.string()
        .matches(/\(\d{2}\) \d{5}-\d{4}/, 'Celular inválido')
        .required('Celular é obrigatório'),
      apelido: Yup.string(),
      matricula: Yup.string().required('Matrícula é obrigatória'),
    }),

    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        dt_nascimento: new Date(values.dt_nascimento).toISOString().split('T')[0], // Formata a data para YYYY-MM-DD
      };

      if (editingId === null) {
        // Create new aluno
        api.post('/aluno', formattedValues)
          .then(response => {
            setAlunos([...alunos, response.data.data]); // Acesse a propriedade 'data' do objeto de resposta
            formik.resetForm();
          })
          .catch(error => {
            console.error('Erro ao criar aluno:', error);
          });

      } else {
        // Update existing aluno
        api.put(`/aluno/${editingId}`, formattedValues)
          .then(response => {
            setAlunos(alunos.map(aluno => (aluno.id === editingId ? response.data.data : aluno))); // Acesse a propriedade 'data' do objeto de resposta
            setEditingId(null);
            formik.resetForm();
          })
          .catch(error => {
            console.error('Erro ao atualizar aluno:', error);
          });
      }
    },
  });

  const handleEdit = (aluno: Aluno) => {
    setEditingId(aluno.id);
  
    // Verifique se cada valor é válido e, caso contrário, use um valor padrão
    formik.setValues({
      nome: aluno.nome || '',  // Garante que 'nome' nunca seja undefined ou null
      cpf: aluno.cpf || '',     // Fallback para string vazia
      email: aluno.email || '', // Fallback para string vazia
      dt_nascimento: aluno.dt_nascimento ? aluno.dt_nascimento.split('T')[0] : '', // Formata data no formato YYYY-MM-DD
      celular: aluno.celular || '', // Fallback para string vazia
      apelido: aluno.apelido !== undefined && aluno.apelido !== null ? aluno.apelido : '', // Fallback para string vazia
      matricula: aluno.matricula || '', // Garante que 'matricula' tenha valor válido
    });
  };
  

  const handleDelete = (id: number) => {
    api.delete(`/aluno/${id}`)
      .then(() => {
        setAlunos(alunos.filter(aluno => aluno.id !== id));
      })
      .catch(error => {
        console.error('Erro ao excluir aluno:', error);
      });
  };

  return (
    <div className="max-w-md mx-auto p-4 border border-gray-300 rounded">
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
            Nome
          </label>
          <input
            type="text"
            id="nome"
            name="nome"
            value={formik.values.nome}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.nome && formik.errors.nome ? (
            <div className="text-red-600 text-sm">{formik.errors.nome}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="cpf" className="block text-sm font-medium text-gray-700">
            CPF
          </label>
          <InputMask
            mask="999.999.999-99"
            id="cpf"
            name="cpf"
            value={formik.values.cpf}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.cpf && formik.errors.cpf ? (
            <div className="text-red-600 text-sm">{formik.errors.cpf}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-600 text-sm">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="dt_nascimento" className="block text-sm font-medium text-gray-700">
            Data de Nascimento
          </label>
          <input
            type="date"
            id="dt_nascimento"
            name="dt_nascimento"
            value={formik.values.dt_nascimento}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.dt_nascimento && formik.errors.dt_nascimento ? (
            <div className="text-red-600 text-sm">{formik.errors.dt_nascimento}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="celular" className="block text-sm font-medium text-gray-700">
            Celular
          </label>
          <InputMask
            mask="(99) 99999-9999"
            id="celular"
            name="celular"
            value={formik.values.celular}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.celular && formik.errors.celular ? (
            <div className="text-red-600 text-sm">{formik.errors.celular}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="apelido" className="block text-sm font-medium text-gray-700">
            Apelido
          </label>
          <input
            type="text"
            id="apelido"
            name="apelido"
            value={formik.values.apelido}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.apelido && formik.errors.apelido ? (
            <div className="text-red-600 text-sm">{formik.errors.apelido}</div>
          ) : null}
        </div>
        <div className="mb-4">
          <label htmlFor="matricula" className="block text-sm font-medium text-gray-700">
            Matrícula
          </label>
          <input
            type="text"
            id="matricula"
            name="matricula"
            value={formik.values.matricula}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          {formik.touched.matricula && formik.errors.matricula ? (
            <div className="text-red-600 text-sm">{formik.errors.matricula}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-indigo-600 text-white font-medium text-sm leading-5 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {editingId === null ? 'Adicionar' : 'Atualizar'}
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Lista de Alunos</h2>
        <ul>
          {alunos.map((aluno) => (
            <li key={aluno.id} className="mb-2 p-2 border border-gray-300 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <p><strong>Nome:</strong> {aluno.nome}</p>
                  <p><strong>CPF:</strong> {aluno.cpf}</p>
                  <p><strong>Email:</strong> {aluno.email}</p>
                  <p><strong>Data de Nascimento:</strong> {aluno.dt_nascimento}</p>
                  <p><strong>Celular:</strong> {aluno.celular}</p>
                  <p><strong>Apelido:</strong> {aluno.apelido}</p>
                  <p><strong>Matrícula:</strong> {aluno.matricula}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(aluno)}
                    className="px-4 py-2 bg-yellow-500 text-white font-medium text-sm leading-5 rounded-md shadow-sm hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(aluno.id)}
                    className="px-4 py-2 bg-red-600 text-white font-medium text-sm leading-5 rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CrudForms;