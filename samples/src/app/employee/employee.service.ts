import { Brain } from 'hubot';
import { EmployeeInfo } from './models';
import { Injectable, Inject } from 'injection-js';
import { BRAIN } from 'hubot-framework';

@Injectable()
export class EmployeeService {

    protected readonly employees: EmployeeInfo[] = [{ userId: 'a7d2', username: 'Penny' }];

    constructor(
        @Inject(BRAIN)
        protected brain: Brain) {
    }

    public register(info: EmployeeInfo) {
        this.employees.push(info);
    }

    public getAll() {
        return this.employees;
    }
}
