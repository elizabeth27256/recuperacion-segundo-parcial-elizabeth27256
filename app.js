import express from 'express';
import taskRoutes from './routes/taskroutes.js';

const app = express();

app.use(express.json());
app.use('/tasks', taskRoutes);

app.use((req, res) => {
  res.status(404).json({ error:'El endpoint no fue encontrado' });
});


app.listen(3000, () => {
  console.log("La aplicación está en el puerto 3000");
});

export default app;
