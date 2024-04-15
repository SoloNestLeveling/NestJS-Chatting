import { Injectable, Logger } from "@nestjs/common";
import { Cron, SchedulerRegistry } from "@nestjs/schedule";



// @Injectable()
// export class TaskService {
//     private readonly logger = new Logger(TaskService.name);

//     constructor(
//         private readonly scheduleRegistry: SchedulerRegistry
//     ) {
//         this.addCronJob();
//     }


// @Cron('10 * * * * *')
// runCronJob() {
//     const name = 'cronSample';
//     this.logger.warn(`run! ${name}`);
// }

// addCronJob() {


//     const name = 'cronSample';
//     this.scheduleRegistry.addCronJob(name, this.runCronJob.bind(this));
//     this.logger.warn(`job ${name} added!`);
// }


// }