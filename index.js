//Almacenando módulos de NODE js en constantes para su uso
const http = require("http")
const url = require("url")
const fs = require("fs")


// Creando servidor para el club deportivo
http
    .createServer((req, res) => {
        let {nombre, precio} = url.parse(req.url, true).query
        let deporte = {
            nombre,
            precio
        }

// Capturando data del archivo deportes.json 
        let data = JSON.parse(fs.readFileSync("deportes.json", "utf-8"))
        let deportes = data.deportes

// Disponibilizando ruta para consumo del html
        if (req.url == "/") {
            res.writeHead(200, {"content-type" : "text/html"})
            fs.readFile("index.html", (err, data) => {
            res.end(data)
            })
        }

// Disponibilizando ruta para el consumo de los datos del archivo "deportes.json"
        if (req.url.includes("/deportes")) {
            res.writeHead(200, {"content-type" : "text/html"})
            fs.readFile("deportes.json", "utf-8", (err, data) => {
            res.end(data)
            })
        }

// Disponibilizando ruta para agregar nuevas disciplinas con validación tanto en Front como End para evitar elementos duplicados
        if (req.url.startsWith("/agregar")) {
            if (deportes.find(p => p.nombre == nombre)) {
                console.log(`La disciplina ${nombre} ya existe, intenta con una nueva disciplina`)
                res.end()
            }else {
                deportes.push(deporte)
                fs.writeFileSync("deportes.json", JSON.stringify(data))
                console.log(`Se ha ingresado ${nombre} como nuevo deporte a un valor de $${Number(precio).toLocaleString("es")}`)
                res.end()
            }
            
        }

// Disponibilizando ruta para editar el precio de una disciplina        
        if (req.url.startsWith("/editar")) {
            deportes.map((p) => {
                if (p.nombre == nombre) {
                    p.precio = precio
                    fs.writeFileSync("deportes.json", JSON.stringify(data))
                    res.end()
                }
            })

        }

// Disponibilizando ruta para la eliminación de una disciplina en concreto mediante la aplicación cliente        
        if (req.url.startsWith("/eliminar")) {
            deportes.map((p, i) => {
                if (p.nombre == nombre) {
                    deportes.splice(i, 1)
                    fs.writeFileSync("deportes.json", JSON.stringify(data))
                    res.end()
                }
            })

        }

        
    })
    .listen(3000, () => console.log("El servidor está levantado en el puerto 3000"))