import { Injectable } from "src/contexts/shared/dependency-injection/injectable";
import { Logger } from "src/contexts/shared/logger/domain";

interface Task<T> {
  item: T;
  priority: number;
  action: () => Promise<void>;
}

@Injectable()
export class PriorityScheduler {
  private queue: { priority: number; action: () => Promise<void> }[] = [];
  private isRunning = false;
  private processedOrder: number[] = []; // Almacena el orden de prioridades procesadas

  constructor(private readonly logger: Logger) {}

  addTask(priority: number, action: () => Promise<void>) {
    this.logger.info(`Añadiendo tarea con prioridad ${priority}`);
    this.queue.push({ priority, action });
    this.queue.sort((a, b) => b.priority - a.priority); // Ordenar por prioridad descendente
    this.logger.info(`Cola actual: ${this.queue.map((task) => task.priority).join(', ')}`);
    this.processQueue();
  }

  private async processQueue() {
    if (this.isRunning) return;
    this.isRunning = true;

    while (this.queue.length > 0) {
      const task = this.queue.shift(); // Extrae la tarea con mayor prioridad
      if (task) {
        this.logger.info(`Procesando tarea con prioridad ${task.priority}`);
        try {
          await task.action();
          this.logger.info(`Tarea con prioridad ${task.priority} completada`);
          this.processedOrder.push(task.priority); // Registrar el orden procesado
        } catch (error) {
          this.logger.error(`Error procesando tarea con prioridad ${task.priority}: ${error}`);
        }
      }
    }

    this.isRunning = false;
    this.logger.info('Cola de tareas vacía');
  }

  // Método para consultar el orden procesado
  getProcessedOrder(): number[] {
    return this.processedOrder;
  }
}


