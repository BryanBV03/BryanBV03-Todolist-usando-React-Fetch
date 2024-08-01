import React, { useEffect, useState } from "react";
import { IoMdClose } from "react-icons/io";

const Home2 = () => {
    const [nuevaTarea, setNuevaTarea] = useState("");
    const [tareas, setTareas] = useState([]);

    useEffect(() => {
        fetch("https://playground.4geeks.com/todo/users/BryanBV03")
            .then((response) => response.json())
            .then((data) => {
                setTareas(data.todos);
            })
            .catch((error) => {
                console.log("Error al cargar Tareas:", error);
            });
    }, []);

    const añadirTareas = () => {
        fetch("https://playground.4geeks.com/todo/todos/BryanBV03", {
            method: "POST",
            body: JSON.stringify({
                label: nuevaTarea,
                done: false
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                if (!response.ok) throw new Error("Network was not ok");
                return response.json();
            })
            .then(data => {
                setTareas([...tareas, data]);
                setNuevaTarea("");
            })
            .catch(error => {
                console.log(error);
            });
    };

    const borrarTarea = (id) => {
        fetch(`https://playground.4geeks.com/todo/todos/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (response.ok) {
                    setTareas((prevTareas) => prevTareas.filter((tarea) => tarea.id !== id));
                } else {
                    console.log("Error al eliminar la tarea:", response.statusText);
                }
            })
            .catch((error) => console.log("Error:", error));
    };

    const borrarTodasTareas = () => {
        const deletePromises = tareas.map((tarea) =>
          fetch(`https://playground.4geeks.com/todo/todos/${tarea.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
            },
          })
        );
    
        Promise.all(deletePromises)
          .then((responses) => {
            const allOk = responses.every((response) => response.ok);
            if (allOk) {
                setTareas([]);
            } else {
              console.error("Error al eliminar todas las tareas.");
            }
          })
          .catch((error) => console.error("Error:", error));
      };

    const handleChange = (evento) => {
        setNuevaTarea(evento.target.value);
    };

    const handleClick = () => {
        añadirTareas();
    };

    return (
        <div className="text-center">
            <div className="text-center mt-5">
                <h1>
                    <strong>Lista de Tareas</strong>
                </h1>
            </div>
            <div className="container contenedorDeTarea">
                <div className="d-flex gap-2">
                    <input
                        type="text"
                        placeholder="¿Quieres añadir una Tarea?"
                        className="form-control"
                        onChange={handleChange}
                        value={nuevaTarea}
                    />
                    <button onClick={handleClick} className="btn">
                        Agregar<br></br>Tarea
                    </button>
                </div>
                <h4> Tareas: </h4>
                <div className="contenedor">
                    <ul className="list-group">
                        {tareas.map((tarea, indice) => {
                            return (
                                <li key={tarea.id} className={`list-group-item d-flex justify-content-between align-items-center ${indice % 2 === 0 ? "light-bg-subtle" : "bg-secondary"}`}>
                                    {tarea.label}
                                    < IoMdClose className="IoMdClose" onClick={() => borrarTarea(tarea.id)} />
                                </li>
                            )
                        })}
                    </ul>
                    <button  className="btn mt-3" onClick={borrarTodasTareas}>¿Todas las tareas hechas? <br></br>Pulsa aquí</button>
                </div>
            </div>
        </div>
    );
};

export default Home2;
