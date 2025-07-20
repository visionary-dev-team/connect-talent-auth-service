import { Injectable } from "src/contexts/shared/dependency-injection/injectable";
import { Logger } from "src/contexts/shared/logger/domain";
interface Task<T> {
  priority: number;
  body: T;
  action: () => Promise<void>;
}

interface ProcessedTask<T> {
  priority: number;
  body: T;
}

@Injectable()
export class PriorityScheduler<T> {
  private queue: Task<T>[] = [];
  private processedOrder: ProcessedTask<T>[] = []; // Almacena las tareas procesadas
  private isRunning = false;

  constructor(private readonly logger: Logger) { }

  addTask(priority: number, body: T, action: () => Promise<void>) {
    this.logger.info(
      `Añadiendo tarea con prioridad ${priority} y datos ${JSON.stringify(body)}`
    );
    console.log("validate body", body)
    this.queue.push({ priority, body, action });
    this.queue.sort((a, b) => b.priority - a.priority);
    this.logger.info(
      `Cola actual: ${this.queue.map((task) => task.priority).join(', ')}`
    );
    this.processQueue();
  }

  private async processQueue() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift(); // Extrae la tarea con mayor prioridad
      if (task) {
        this.logger.info(
          `Procesando tarea con prioridad ${task.priority} y datos ${JSON.stringify(task.body)}`
        );
        try {
          await task.action();
          this.logger.info(
            `Tarea con prioridad ${task.priority} completada`
          );
          // Agregar la tarea procesada al historial
          console.log("body-task", task)
          this.processedOrder.push({ priority: task.priority, body: task.body });
        } catch (error) {
          this.logger.error(`Error procesando tarea con prioridad ${task.priority}: ${error}`);
        }
      }
    }

    this.isRunning = false;
    this.logger.info('Cola de tareas vacía');
  }

  // Método para consultar el historial de procesamiento
  getProcessedOrder(): ProcessedTask<T>[] {
    return this.processedOrder;
  }
}
