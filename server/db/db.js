const { mongoose } = require("mongoose")
require("dotenv").config();
const uri = process.env.MONGO_URI
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log("Conectado a la base de datos"))
.catch((error)=>console.log("Error al conectarse en la base de datos", error))