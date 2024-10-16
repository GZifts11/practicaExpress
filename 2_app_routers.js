const express = require('express')
const PORT = 3000
const HOSTNAME = '127.0.0.1'

const { alumnos } = require('./src/alumnos.js')
const { validarCorrelativa, inscribirAlumno } = require('./controller.js')

const app = express()

//Middleware
app.use(express.json())

//Routers
const routerFrontend = express.Router();
app.use('/api/alumnos/frontend', routerFrontend)

const routerBackend = express.Router();
app.use('/api/alumnos/backend', routerBackend)

app.get("/", (req, res) => {
    console.log("Estoy ingresando a la ruta raiz de mi servidor")
    res.send("<h1>INGRESANDO A LA RUTA RAIZ</h1>")
})

app.get("/api/", (req, res) => {
    console.log("Estoy ingresando a /api/")
    res.send("<h1>INGRESANDO A /API</h1>")
})

app.get("/api/alumnos/", (req, res) => {
    console.log("Estoy ingresando a /api/")
    res.end(JSON.stringify(alumnos))
})

routerFrontend.get("/", (req, res) => {
    console.log("Estoy ingresando a /api/alumnos/frontend")
    res.end(JSON.stringify(alumnos.frontend))
})

routerFrontend.get("/:turno", (req, res) => {
    const turno = req.params.turno.toLocaleLowerCase();
    console.log("Turno " + turno)
    console.log("Estoy ingresando a /api/alumnos/frontend")
    const filtrado = alumnos.frontend.filter(
        (alumno) => alumno.turno.toLocaleLowerCase() == turno
    );

    if(filtrado.length === 0){
        res.status(404).end(`No se encontraron alumnos de frontend en el turno ${turno}`)
    }else{
        console.log(filtrado)
        //res.status(200).end(JSON.stringify(filtrado))
        res.status(200).send(JSON.stringify(filtrado))
    }
    
})

routerFrontend.get("/inscribir_examen/:id/:materia", (req, res) => {
    const id = req.params.id
    const materia = req.params.materia
    console.log(`id: ${id}`)
    const alumnoEncontrado = alumnos.frontend.find(
        alumno => {
            console.log(`alumno: ${alumno}`)
            return alumno.id == id
        })
        
        if( alumnoEncontrado != undefined){
            validarCorrelativa(alumnoEncontrado, materia)
                .then( response => { 
                    console.log(response)
                    //res.send(response)
                    return inscribirAlumno(alumnoEncontrado, materia)
                })
                .then( response => {
                    console.log(`response de inscribirAlumno: ${response}`)
                    res.send(response)
                })
                .catch( error => {
                    console.log("catch() - entre al catch")
                    console.log(error)
                    res.send(error)
                }
                )
        }else {
            res.status(404).send(`No se encontró ningún alumno con el id: ${id} `)
        }
})

routerFrontend.post("/inscribir_alumno", (req, res) => {
    const alumnoNuevo = req.body;
    alumnos.frontend.push(alumnoNuevo);
    res.status(200).send(JSON.stringify(alumnos.frontend))
})

routerFrontend.put("/:id", (req, res) => {
    const id = req.params.id
    const alumnoActualizado = req.body

    const indice = alumnos.frontend.findIndex( alumno => alumno.id == id)

    if(indice >= 0){
        alumnos.frontend[indice] = alumnoActualizado
    }else {
        res.status(404).send(`No se encontró algún alumno que coincida con el id: ${id}`)
    }
    
    res.status(200).send(alumnos.frontend)

})

routerFrontend.patch("/:id", (req, res) => {
    const id = req.params.id
    const alumnoActualizado = req.body
    const indice = alumnos.frontend.findIndex( alumno => alumno.id == id)

    if(indice >= 0){
        const alumnoAModificar = alumnos.frontend[indice];
        Object.assign(alumnoAModificar, alumnoActualizado)
    }else {
        res.status(404).send(`No se encontró algún alumno que coincida con el id: ${id}`)
    }

    res.status(200).send(alumnos.frontend)

})

routerFrontend.delete("/:id", (req, res) => {
    const id = req.params.id
    const indice = alumnos.frontend.findIndex( alumno => alumno.id == id)

    if(indice >= 0){
        alumnos.frontend.splice(indice, 1)
    }else{
        res.status(404).send(`No se encontró algún alumno que coincida con el id: ${id}`)
    }
    res.status(200).send(alumnos.frontend)
})


routerBackend.get("/", (req, res) => {
    console.log("Estoy ingresando a /api/alumnos/backend")
    res.end(JSON.stringify(alumnos.backend))
})

routerBackend.get("/:turno", (req, res) => {
    const turno = req.params.turno.toLocaleLowerCase();
    console.log("Turno " + turno)
    console.log("Estoy ingresando a /api/alumnos/frontend")
    const filtrado = alumnos.backend.filter(
        (alumno) => alumno.turno.toLocaleLowerCase() == turno
    );

    if(filtrado.length === 0){
        res.status(404).end(`No se encontraron alumnos de backend en el turno ${turno}`)
    }else{
        console.log(filtrado)
        //res.status(200).end(JSON.stringify(filtrado))
        res.status(200).send(JSON.stringify(filtrado))
    }
    
})


routerBackend.post("/inscribir_alumno", (req, res) => {
    const alumnoNuevo = req.body;
    alumnos.backend.push(alumnoNuevo);
    res.status(200).send(JSON.stringify(alumnos.backend))
})

routerBackend.put("/:id", (req, res) => {
    const id = req.params.id
    const alumnoActualizado = req.body

    const indice = alumnos.backend.findIndex( alumno => alumno.id == id)

    if(indice >= 0){
        alumnos.backend[indice] = alumnoActualizado
    }else {
        res.status(404).send(`No se encontró algún alumno que coincida con el id: ${id}`)
    }

    res.status(200).send(alumnos.backend)

})



routerBackend.delete("/:id", (req, res) => {
    const id = req.params.id
    const indice = alumnos.backend.findIndex( alumno => alumno.id == id)

    if(indice >= 0){
        alumnos.backend.splice(indice, 1)
    }else{
        res.status(404).send(`No se encontró algún alumno que coincida con el id: ${id}`)
    }
    res.status(200).send(alumnos.backend)
})

app.listen(PORT, HOSTNAME, () => {
    console.log(`El servidor está corriendo en http://${HOSTNAME}:${PORT}/`)
})



