class TaskModel {
  constructor() {
    this.tasks = [];
  }

  getAll() {
    return Promise.resolve(this.tasks);
  }

  findById(id) {
    const task = this.tasks.find(t => t.id === Number(id));
    return Promise.resolve(task);
  }

  create(taskData) {
    if (this.tasks.some(t => t.id === taskData.id)) {
      return Promise.reject(new Error('El id de la tarea ya existe'));
    }
    this.tasks.push(taskData);
    return Promise.resolve(taskData);
  }

  update(id, data) {
    const index = this.tasks.findIndex(t => t.id === Number(id));
    if (index === -1) return Promise.resolve(null);

    this.tasks[index] = { ...this.tasks[index], ...data };
    return Promise.resolve(this.tasks[index]);
  }

  delete(id) {
    const index = this.tasks.findIndex(t => t.id === Number(id));
    if (index === -1) return Promise.resolve(false);

    this.tasks.splice(index, 1);
    return Promise.resolve(true);
  }
}

export default TaskModel;
