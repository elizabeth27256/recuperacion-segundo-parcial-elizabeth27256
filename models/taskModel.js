class TaskModel {
  static tasks = [];

  static getAll() {
    return Promise.resolve(this.tasks);
  }

  static findById(id) {
    const task = this.tasks.find(t => t.id === Number(id));
    return Promise.resolve(task);
  }

  static create(taskData) {
    const exists = this.tasks.some(t => t.id === taskData.id);
    if (exists) {
      return Promise.reject(new Error('El id de la tarea ya existe'));
    }
    this.tasks.push(taskData);
    return Promise.resolve(taskData);
  }

  static update(id, data) {
    const index = this.tasks.findIndex(t => t.id === Number(id));
    if (index === -1) return Promise.resolve(null);

    this.tasks[index] = { ...this.tasks[index], ...data };
    return Promise.resolve(this.tasks[index]);
  }

  static delete(id) {
    const index = this.tasks.findIndex(t => t.id === Number(id));
    if (index === -1) return Promise.resolve(false);

    this.tasks.splice(index, 1);
    return Promise.resolve(true);
  }

  static searchByTitle(title) {
    const text = title.toLowerCase();
    const result = this.tasks.filter(t =>
      t.title.toLowerCase().includes(text)
    );
    return Promise.resolve(result);
  }

  static getSummary() {
    const total = this.tasks.length;
    const completed = this.tasks.filter(t => t.completed === true).length;
    const percentage = total === 0 ? 0 : (completed * 100) / total;

    const priorities = this.tasks
      .map(t => t.priority)
      .filter(p => typeof p === 'number');

    const sum = priorities.reduce((acc, p) => acc + p, 0);
    const averagePriority = priorities.length > 0 ? sum / priorities.length : 0;

    return Promise.resolve({
      total,
      completed,
      percentageCompleted: `${percentage.toFixed(2)}%`,
      averagePriority: Number(averagePriority.toFixed(2))
    });
  }
}

export default TaskModel;

