const Career = require("../models/careerModel");  //la importacion desde el archivo careerModel.js

const careerPost = (req, res) => {  //se encargara de manejar las solicitudes HTTP POST para crear una nueva carrera.
  
  let career = new Career(); //se crea la estructura que va a la base de datos
  career.name = req.body.name;    
  career.code = req.body.code;
  career.description = req.body.description;
  career
    .save()  //se usa este metodo para cargar, haciendo que si se guarda la carrera exitosamente se ejecuta el bloque de codigo creando en json
    .then(() => {
        res.status(201); 
        res.header({
        location: `/api/career/?id=${career.id}`,
        });
        res.json(career);
    })
    .catch((err) => {  //si hubo algun error al crear la carrera en la consola se imprime el mensaje de error y a la bd va un json con mensaje de error
        res.status(422); //eror de solicitud
        console.log("error", err);
        res.json({
        error: "error",
        });
    });
    };


const careerGet = (req, res) => {
  if (req.query && req.query.id) { //el objeto tiene una propiedad id y Si es así, significa que el cliente está solicitando una carrera específica por su ID.
    Career.findById(req.query.id) //buscar una carrera específica por su ID.
      .then((career) => { //Si se encuentra la carrera, se devuelve en formato JSON como respuesta.
        res.json(career);
      })
      .catch((err) => { //caso contrario en consola muestra mensaje de error y a la bd manda un json con mensaje de error
        res.status(404);
        console.log("error", err);
        res.json({ error: "Career does not exist" });
      });
  } else { //en este else es para traer las carreras sin necesidad del ID sino que solo las lista todas en orden en el .then, en el .catch es en caso de dar error
    Career.find()
      .then((career) => {
        res.json(career);
      })
      .catch((err) => {
        res.status(433);
        res.json({ error: err });
      });
  }
};

const careerPut = async (req, res) => {
  if (req.query && req.query.id) {
    const careerId = req.query.id;

    try {
        const updatedCareer = await Career.findByIdAndUpdate(
            careerId, //ID de la carrera que será actualizada
            {
                $set: {
                    name: req.body.name,
                    code: req.body.code,
                    description: req.body.description
                }
            },
            { new: true, runValidators: true } //devuelve el doc actualizado al lugar original y valida que los datos enviados sean correctos
        );

        if (!updatedCareer) {
            return res.status(404).json({ error: "Career doesn't exist" }); //esto pasa si el ID no corresponde a ninguna carrera
        }

        return res.status(200).json(updatedCareer); // si todo sale bien devuelve la carrera editada en un formato json
    } catch (err) {
        console.error('Error:', err);
        return res.status(500).json({ error: 'error' });
    }
  }
};

async function careerDelete(req, res) {
  if (req.query && req.query.id) {
    try {
      // Primero, intenta encontrar la carrera para asegurarte de que existe
      const career = await Career.findById(req.query.id);
      if (!career) {
        // Si la carrera no existe, devuelve un error 
        return res.status(404).json({ error: "Career does not exist" });
      }

      // Si la carrera existe, procede a eliminarla
      await Career.deleteOne({ _id: req.query.id });
      return res.status(204).json({});
    } catch (err) {
      console.error("Error while handling the career:", err);
      return res.status(500).json({ error: "There was an error processing the career" });
    }
  } else {
    // Si no se proporciona un ID da error
    return res.status(400).json({ error: "No ID provided" });
  }
}

module.exports = {  //exporta las funciones
  careerPost,
  careerGet,
  careerPut,
  careerDelete
};