import { Robot } from 'hubot';
import { EmployeeService } from './employee.service';
import { HubotModule, HubotModuleDefinition } from '../../../dist';

@HubotModule({
    providers: [
        EmployeeService
    ]
})
export class EmployeeModule implements HubotModuleDefinition {

    constructor(private employee: EmployeeService) { }

    public run(robot: Robot) {

        robot.respond(/employees$/, (res) => {
            res.send(`${this.employee.getAll().length} employees registered.`,
                this.employee.getAll().map(e => `${e.username}`).join(','));
        });

        robot.respond(/register employee (.*)/, (res) => {
            const name = res.match[1];
            this.employee.register({
                userId: new Date().toJSON(),
                username: name
            });
            res.send(`Employee ${name} has been registered.`);
        });
    }
}
