// Description:
//   Root Hubot Module. All your modules must be imported.
//
// Author:
//   Leonardo Chaia (lchaia@astonishinglab.com)

import { HubotModule } from 'hubot-framework';
import { EmployeeModule } from './employee/employee.module';

@HubotModule({
    imports: [
        EmployeeModule,
    ],
})
export class AppModule { }
