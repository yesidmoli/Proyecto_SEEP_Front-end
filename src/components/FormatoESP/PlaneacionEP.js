import React, { Fragment, useState, useRef, useEffect } from "react";
import SignatureCanvas from "react-signature-canvas";
import "./css/planeacionEP.css";
import { Link } from "react-router-dom";
import { Popup } from "reactjs-popup";
import { useFormContext } from './FormProvide';
import clienteAxios from "../../config/axios";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";
function PlaneacionEP({ goToNextComponent, data , id}) {

  const {token} = useAuth()
  // const { formData: { planeacion: contextFormData }, updateFormData } = useFormContext();// Renombramos el formData del contexto para evitar conflictos
  const [formData, setFormData] = useState({
    actividades: [],
    observaciones: "",
    nombre_enteconformador: "",
    firma_enteconformador: "",
    firma_aprendiz: "",
    nombre_instructor: "",
    firma_instructor: "",
    aprendiz: id
  });

  const [idPlaneacion, setIdPlaneacion] = useState(null)




  const [signatureRef, setSignatureRef] = useState(null);
  const [aprendizRef, setAprendizSignatureRef] = useState(null);
  const [instructorRef, setInstructorSignatureRef] = useState(null);


  //obtenemos el rol del usuario
  const rol = localStorage.getItem('rol')

  const handleAddActividad = () => {
    setFormData((prevState) => ({
      ...prevState,
      actividades: [
        ...prevState.actividades,
        {
          nombre_actividad: "",
          tiene_evidencia_aprendizaje: "",
          fecha_recoleccion_evidencia: "",
          lugar_recoleccion_evidencia: ""
        }
      ]
    }));
  };

  const handleRemoveActividad = (index) => {
    setFormData((prevState) => ({
      ...prevState,
      actividades: prevState.actividades.filter((_, i) => i !== index)
    }));
  };

  // const handleChange = (e, index) => {
  //   const { name, value } = e.target;
  //   setFormData((prevState) => {
  //     const actividades = [...prevState.actividades];
  //     actividades[index][name] = value;
  //     return { ...prevState, actividades };
  //   });
  // };
  const handleChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => {
      const actividades = [...prevState.actividades];
      if (type === "checkbox") {
        actividades[index][name] = checked;
      } else {
        actividades[index][name] = value;
      }
      return { ...prevState, actividades };
    });
  };


  const handleGuardarDatos = async () => {
    try {
      if (idPlaneacion) {
        // Si existe un ID en el formData, significa que ya existe un registro y debemos actualizarlo
        await clienteAxios.put(`/api/formato/planeacion/${idPlaneacion}/`,formData, {
          headers: {
              Authorization: `Token ${token}`
          }
      });
        // Actualiza los datos existentes
      } else {
        //Actualizamos formData con el id del aprendiz, para que no hayan errores de nulidad
        // Si no existe un ID en el formData, significa que es un nuevo registro y debemos crearlo
        await clienteAxios.post('/api/formato/planeacion/', formData, {
          headers: {
              Authorization: `Token ${token}`
          }
      }); // Crea nuevos datos
      }
      // Manejar éxito de la solicitud si es necesario
      console.log('Datos enviados correctamente');
      Swal.fire({
        title: "Exitoso",
        text: "Datos guardados correctamente!",
        icon: "success"
      });
    } catch (error) {
      // Manejar errores de la solicitud si es necesario
      console.error('Error al enviar los datos:', error);
      let errorMessage = "Error al enviar los datos:";
      
      Swal.fire("Error", errorMessage, "error");
    }
  };

  useEffect(() => {
    const fetchData = async () => {

      try {
        const response = await clienteAxios.get(`/api/formato/planeacion/?aprendiz_id=${id}`, {
          headers: {
              Authorization: `Token ${token}`
          }
      });
        const responseData = response.data;

  
        if (responseData.length > 0) {
          const data = responseData[0];
          setFormData(data);
          setIdPlaneacion(data.id)
        }

      } catch (error) {
        // if (error.response && error.response.status === 404) {
        //   resetFormData();
        // }
        console.error('Error al obtener los datos de la API:', error);
      }
    };

    fetchData();

  }, [idPlaneacion, id]);

  const clearSignature = (ref) => {
    ref.clear();

  };

  // const saveSignature = () => {
  //   const signatureImage = signatureRef.getTrimmedCanvas().toDataURL("image/png");
  //   console.log("Signature Image:", signatureImage);
  //   setFormData((prevState) => ({ ...prevState, firma_enteconformador: signatureImage }));
  // };

  const saveSignature = (ref, fieldName) => {
    const signatureImage = ref.getTrimmedCanvas().toDataURL("image/png");
    console.log("Signature Image:", signatureImage);
    setFormData((prevState) => ({ ...prevState, [fieldName]: signatureImage }));
  };

  return (
    <Fragment>
      <div className="container planeacion-cont">
        <h1 className="h1-planeacion">2. PLANEACIÓN ETAPA PRODUCTIVA</h1>
        <h2 className="h2-planeacion">
          CONCRETACIÓN PLAN DE TRABAJO DURANTE LA ETAPA PRODUCTIVA DEL APRENDIZ
        </h2>

        <form id="planForm">
          <table>
            <thead className="header-table-planeacion">
              <tr >
                <th><h5 className="h6-table">ACTIVIDADES A DESARROLLAR</h5><i>Relacionar funciones o actividades que respondan al resultado de aprendizaje de la Etapa Productiva y al Perfil del egresado establecido en el programa de formación.</i></th>
                <th>Evidencia de Aprendizaje</th>

                <th>Fecha de recoleccion</th>
                <th>Lugar de recoleccion</th>
                <th></th>
              </tr>
            </thead>

            <tbody  >
              {formData.actividades.map((actividad, index) => (
                <tr key={index} >
                  <td>
                    <input disabled ={rol==="aprendiz"} className="name-actividad input-planeacion" placeholder="Ingrese la actividad"
                      name="nombre_actividad"

                      value={actividad.nombre_actividad}
                      onChange={(e) => handleChange(e, index)}
                    ></input>
                  </td>
                  <td>
                    <input disabled ={rol==="aprendiz"} type="checkbox" className="input-si-evidencia input-planeacion"

                      name="tiene_evidencia_aprendizaje"
                      rows="2"
                      checked={actividad.tiene_evidencia_aprendizaje}
                      onChange={(e) => handleChange(e, index)}
                    ></input>
                  </td>
                  <td>
                    <input disabled ={rol==="aprendiz"} type="date" className="input-planeacion "

                      name="fecha_recoleccion_evidencia"
                      rows="2"
                      value={actividad.fecha_recoleccion_evidencia}
                      onChange={(e) => handleChange(e, index)}
                    ></input>
                  </td>
                  <td>
                    <input disabled ={rol==="aprendiz"} className="input-planeacion"
                      placeholder="Ingrese el lugar"
                      name="lugar_recoleccion_evidencia"
                      rows="2"
                      value={actividad.lugar_recoleccion_evidencia}
                      onChange={(e) => handleChange(e, index)}
                    ></input>
                  </td>
                  <td>
                    {rol !== "aprendiz" ? <button className="btn-eliminar"  disabled ={rol==="aprendiz"} type="button" onClick={() => handleRemoveActividad(index)}>
                      Eliminar
                    </button> 
                    : null}
                   
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rol !== "aprendiz" ? 
          <button className="btn-añadir" type="button" onClick={handleAddActividad} disabled ={rol==="aprendiz"}>
          Añadir Actividad
        </button>
          :null}
          

          <div className="observaciones-planeacion">
            <h5>OBSERVACIONES</h5>
            <textarea
              disabled ={rol==="aprendiz"}
              name="observaciones"
              rows="4"
              value={formData.observaciones}
              onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            ></textarea>
          </div>

          <div className="camp-firma">
            <div className="nombre-ente">
              <label> <h5>Nombre y firma del ente Conformador</h5></label>
              <input   disabled={rol==="aprendiz"}placeholder="Nombre ente conformador" className="input-planeacion" value={formData.nombre_enteconformador}
                onChange={(e) => setFormData({ ...formData, nombre_enteconformador: e.target.value })}></input>
            </div>

            <div className="campo-firma-planeacion">

              <section className="img-signature">
                {formData.firma_enteconformador ? (
                  <img
                    src={formData.firma_enteconformador}
                    alt="Firma del Ente Conformador"
                    style={{
                      display: "block",
                      margin: "0 auto",

                      width: "100%",
                      height: "100%"
                    }}
                  />
                ) : null}
              </section>
              
              <Popup trigger={<button type="button"  className="btn-eliminar"  disabled={rol==="aprendiz"} >Firmar</button>} modal>

                {(close) => (
                  <div className="popup campo-firma">
                    <section className="head-signature">
                      <button className="close" onClick={close}>
                        &times;
                      </button>

                      <h2>Firma ente Conformador</h2>
                      <i class="bi bi-trash3-fill" onClick={() => clearSignature(signatureRef)}></i>
                    </section>

                    <SignatureCanvas
                      penColor="black"
                      canvasProps={{ width: 590, height: 246, className: "signature-canvas" }}
                      ref={(ref) => setSignatureRef(ref)}
                      // penOptions={{
                      //   minWidth: 2,  // Grosor mínimo del trazo
                      //   maxWidth: 4,  // Grosor máximo del trazo
                      //   throttle: 0.5, // Velocidad de actualización del trazo
                      // }}
                      minWidth={1}
                      maxWidth={1}
                      velocityFilterWeight ={0.1}
                    />

                    <div className="btn-guardar-firma">
                      <button className="btn btn-success " onClick={() => { saveSignature(signatureRef, "firma_enteconformador"); close(); }}>
                        Guardar Firma
                      </button>
                    </div>



                  </div>
                )}
              </Popup>
            </div>
          </div>
          <div className="camp-firma">
            <div className="nombre-aprendiz-ep">
              <label><h5>Firma del Aprendiz</h5></label>
            </div>

            <div className="campo-firma-planeacion">
              <section className="img-signature">
                {formData.firma_aprendiz ? (
                  <img
                    src={formData.firma_aprendiz}
                    alt="Firma del Aprendiz"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                ) : null}
              </section>

              <Popup trigger={<button  className="btn-eliminar" type="button">Firmar</button>} modal>
                {(close) => (
                  <div className="popup campo-firma">
                    <section className="head-signature">
                      <button className="close" onClick={close}>
                        &times;
                      </button>
                      <h2>Firma del Aprendiz</h2>
                      <i className="bi bi-trash3-fill" onClick={() => clearSignature(aprendizRef)}></i>
                    </section>

                    <SignatureCanvas
                      penColor="black"
                      canvasProps={{ width: 590, height: 246, className: "signature-canvas" }}
                      ref={(ref) => setAprendizSignatureRef(ref)}
                      minWidth={1}
                      maxWidth={1}
                      velocityFilterWeight ={0.1}
                    />

                    <div className="btn-guardar-firma">
                      <button className="btn btn-success" onClick={() => { saveSignature(aprendizRef, "firma_aprendiz"); close(); }}>
                        Guardar Firma
                      </button>
                    </div>
                  </div>
                )}
              </Popup>
            </div>
          </div>
          <div className="camp-firma">
            <div className="nombre-instructor">
              <label><h5>Nombre y firma del Instructor</h5></label>
              <input
                disabled ={rol==="aprendiz"}
                value={formData.nombre_instructor}
                onChange={(e) => setFormData({ ...formData, nombre_instructor: e.target.value })}
                placeholder="Nombre del Instructor"
                className="input-planeacion"
              />
            </div>

            <div className="campo-firma-planeacion">
              <section className="img-signature">
                {formData.firma_instructor ? (
                  <img
                    src={formData.firma_instructor}
                    alt="Firma del Instructor"
                    style={{
                      display: "block",
                      margin: "0 auto",
                      width: "100%",
                      height: "100%"
                    }}
                  />
                ) : null}
              </section>
              {rol !== "aprendiz" ?
              <Popup trigger={<button className="btn-eliminar" type="button">Firmar</button>} modal>
              {(close) => (
                <div className="popup campo-firma">
                  <section className="head-signature">
                    <button className="close" onClick={close}>
                      &times;
                    </button>
                    <h2>Firma del Instructor</h2>
                    <i className="bi bi-trash3-fill" onClick={() => clearSignature(instructorRef)}></i>
                  </section>

                  <SignatureCanvas
                    penColor="black"
                    canvasProps={{ width: 590, height: 246, className: "signature-canvas" }}
                    ref={(ref) => setInstructorSignatureRef(ref)}
                    minWidth={1}
                    maxWidth={1}
                    velocityFilterWeight ={0.1}
                  />

                  <div className="btn-guardar-firma">
                    <button className="btn btn-añadir" onClick={() => { saveSignature(instructorRef, "firma_instructor"); close(); }}>
                      Guardar Firma
                    </button>
                  </div>
                </div>
              )}
            </Popup>
              : null}
              
            </div>
          </div>




          <div className="btn btn-success btn-añadir" onClick={handleGuardarDatos}>
            <h5>Guardar</h5>
          </div>
        </form>
        {/* <Link to="/seguimiento_EP" className="custom-button">
          Siguiente
        </Link> */}
      </div>
    </Fragment>
  );
}

export default PlaneacionEP;
