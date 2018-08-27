// Description:
//   Root Hubot Module. All your modules must be imported.
//
// Author:
//   Leonardo Chaia (lchaia@astonishinglab.com)

import 'reflect-metadata';

import { HubotModule, bootstrapModule } from '../../dist';
import { EmployeeModule } from './employee';

@HubotModule({
    imports: [
        EmployeeModule,
    ],
})
class SamplesModule { }

// Required only for the root module
export = bootstrapModule(SamplesModule);
