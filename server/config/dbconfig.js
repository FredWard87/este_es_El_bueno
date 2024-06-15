const mongoose = require("mongoose");
const Usuarios = require('../models/usuarioSchema');
const Areas = require('../models/areasSchema');

// Cargar variables de entorno desde el archivo .env
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

const departamentosData = [
  {
    departamento: 'Administración',
    areas: ['Compras', 'Sistemas', 'Recursos Humanos']
  },
  {
    departamento: 'Aseguramiento de calidad',
    areas: ['Físico Químico', 'Microbiología', 'Sensorial', 'Empaque']
  },
  {
    departamento: 'Gestión para la calidad',
    areas: ['Control y cuidado ambiental', 'Capacitación']
  },
  {
    departamento: 'Gestión para la productividad',
    areas: ['Seguridad e higiene y sanidad']
  },
  {
    departamento: 'Ingeniería',
    areas: []
  },
  {
    departamento: 'Mantenimiento',
    areas: ['Tetra pak', 'Servicios', 'Electrónico']
  },
  {
    departamento: 'Planeación y Logística',
    areas: ['Materia prima', 'Pesadas', 'Producto terminado']
  },
  {
    departamento: 'Producción',
    areas: ['Preparación', 'Proceso Térmico', 'Almacenamiento aséptico', 'Envasado', 'Embalaje']
  }
];

mongoose.connection.on('error', console.error.bind(console, 'Error de conexión a MongoDB:'));
mongoose.connection.on('connected', async () => {
  console.log('Conexión exitosa a MongoDB');

  try {
    // Verificar y crear usuario root
    const user = await Usuarios.findOne({ Correo: 'ruben@gmail.com' });
    if (!user) {
      const rootUser = new Usuarios({
        Nombre: 'Ruben',
        FechaIngreso: new Date(),
        Correo: 'ruben@gmail.com',
        Contraseña: 'root321', // Asegúrate de encriptar esta contraseña en un entorno de producción
        Departamento: 'general',
        Puesto: 'Global',
        Escolaridad: 'Ingenieria en Alimentos',
        TipoUsuario: 'Administrador'
      });

      await rootUser.save();
      console.log("Usuario root creado");
    } else {
      console.log("Usuario root ya existe");
    }

    // Verificar y crear departamentos y áreas
    for (const deptData of departamentosData) {
      const existingDept = await Areas.findOne({ departamento: deptData.departamento });
      if (!existingDept) {
        const newDept = new Areas(deptData);
        await newDept.save();
        console.log(`Departamento ${deptData.departamento} creado`);
      } else {
        console.log(`Departamento ${deptData.departamento} ya existe`);
      }
    }
  } catch (err) {
    console.error("Error al inicializar la base de datos:", err);
  }
});

// Conectar a MongoDB
mongoose.connect(MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.error('Error al conectar a MongoDB:', err));

module.exports = mongoose;
