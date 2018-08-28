import { EmployeeService } from './employee.service';
import { HubotModule, HubularRobot, ROBOT } from 'hubular';
import { Inject } from 'injection-js';

@HubotModule({
    providers: [
        EmployeeService
    ]
})
export class EmployeeModule {

    constructor(
        private employee: EmployeeService,
        @Inject(ROBOT)
        private robot: HubularRobot) {

        this.bindToRobot();
    }

    protected bindToRobot() {

        this.robot.respond(/employees$/, (res) => {
            res.send(`${this.employee.getAll().length} employees registered.`,
                this.employee.getAll().map(e => `${e.username}`).join(','));
        });

        this.robot.respond(/register employee (.*)/, (res) => {
            const name = res.match[1];
            this.employee.register({
                userId: new Date().toJSON(),
                username: name
            });
            res.send(`Employee ${name} has been registered.`);
        });
    }
}
