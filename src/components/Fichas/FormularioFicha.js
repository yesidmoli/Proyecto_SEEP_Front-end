import React, { useState, useEffect } from 'react';
import clienteAxios from '../../config/axios';
import ListaFichas from './ListaFichas';
import '../../../src/css/formularioFichas.css'
import Swal from 'sweetalert2';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-dom';
import '../layout/Header';
import '../layout/MainSection';



const FormularioFicha = ({history}) => {



  const initialState = {
    numero_ficha: '',
    nombre_programa: '',
    nivel_formacion: '',
    horario_formacion: '',
  };

  const [ficha, setFicha] = useState(initialState);
  const [fichas, setFichas] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEditar, setIdEditar] = useState(null);
  const [listaFichas, setListaFichas] = useState(false);

 

  useEffect(() => {
    // Lógica para obtener las fichas existentes 
    const obtenerFichas = async () => {
      try {
        const consultarFicha = await clienteAxios.get('/api/fichas/');
        setFichas(consultarFicha.data);
      } catch (error) {
        console.error('Error al obtener las fichas:', error);
      }
    };

    obtenerFichas();
  }, []); 

  const actualizarState = (e) => {
    setFicha({
      ...ficha,
      [e.target.name]: e.target.value,
    });
  };

  const enviarDatos = async (e) => {
    e.preventDefault();

    try {
      if (modoEdicion) {
        // Actualizar ficha existente
        await clienteAxios.put(`/fichas/${idEditar}`, ficha);
        Swal.fire('¡Éxito!', 'La ficha se actualizó correctamente.', 'success');
        
      } else {
        // Crear nueva ficha

        await clienteAxios.post('/api/fichas/', ficha);
        Swal.fire('¡Éxito!', 'La ficha se registró correctamente.', 'success');
        // Redirigir a la sección de listado de fichas
        history.push('/#listado-fichas');

        
      }

      // Actualizar la lista de fichas
      const consultarFicha= await clienteAxios.get('api/fichas/');
      setFichas(consultarFicha.data);

      // Limpiar el formulario y restablecer el estado
      setFicha(initialState);
      setModoEdicion(false);
      setIdEditar(null);
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      Swal.fire('Error', 'Hubo un error al procesar la solicitud.', 'error');
    }
  };
  
  

  const editarFicha = (id) => {
    // Buscar la ficha por ID
    const fichaEditar = fichas.find((f) => f._id === id);

    // Establecer el estado con los datos de la ficha a editar
    setFicha(fichaEditar);
    setModoEdicion(true);
    setIdEditar(id);
  };

  const eliminarFicha = async (id) => {
    try {
      // Mostrar ventana de confirmación
      const confirmacion = await Swal.fire({
        title: '¿Estás seguro?',
        text: 'La ficha será eliminada permanentemente.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
      });
  
      // Si el usuario confirma la eliminación, proceder con la solicitud de eliminación
      if (confirmacion.isConfirmed) {
        await clienteAxios.delete(`/fichas/${id}`);
  
        // Actualizar la lista de fichas después de eliminar
        const consultarFicha = await clienteAxios.get('api/fichas/');
        setFichas(consultarFicha.data);
  
        // Mostrar mensaje de éxito
        Swal.fire('¡Éxito!', 'La ficha se eliminó correctamente.', 'success');
      }
    } catch (error) {
      console.error('Error al eliminar la ficha:', error);
      Swal.fire('Error', 'Hubo un error al procesar la solicitud.', 'error');
    }
  };
  const handleCargarFichas = () => {
    setListaFichas(true);
  }

  if (listaFichas) {
    return <ListaFichas />;
  }


  return (
    <div className='container-fichas'> 
     <Link to={"/nuevo-aprendiz"} aria-label="icon" className="iconLink">
     <button id='registrar-aprendiz'>Registrar Aprendiz</button>
        </Link>
    
      <h2>Registro de Fichas</h2>

      
      <form onSubmit={enviarDatos}>
        <label>Número de Ficha:</label>
        <input
          type="text"
          name="numero_ficha"
          value={ficha.numero_ficha}
          onChange={actualizarState}
        />

        <label>Nombre del Programa:</label>
        <input
          type="text"
          name="nombre_programa"
          value={ficha.nombre_programa}
          onChange={actualizarState}
        />

        <label>Nivel de Formación:</label>
        <input
          type="text"
          name="nivel_formacion"
          value={ficha.nivel_formacion}
          onChange={actualizarState}
        />

        <label>Horario de Formación:</label>
        <input
          type="text"
          name="horario_formacion"
          value={ficha.horario_formacion}
          onChange={actualizarState}
        />

        <div className='container-btn'>
        <button className='registrar-ficha' type="submit">{modoEdicion ? 'Actualizar' : 'Registrar'}</button>
        <button className='listado-fichas' onClick={handleCargarFichas} >Listado de Fichas</button>
        </div>
       
      </form>
      
    {/* <section  id="listado-fichas" className='List-fichas'>
      <h2>Listado de Fichas Registradas</h2>
      <ul className='lista-fichas'>
        {fichas.map((f) => (
          <li  key={f._id}>
            {f.numero_ficha} - {f.nombre_programa} - {f.nivel_formacion} - {f.horario_formacion}

            <div className='btns-crud'>
            <button className='btn-editar' onClick={() => editarFicha(f._id)}>Editar</button>
            <button className='btn-delete' onClick={() => eliminarFicha(f._id)}>Eliminar</button>
            </div>
            
          </li>
        ))}
      </ul>
      </section> */}
    </div>
  );
};

export default withRouter(FormularioFicha);
