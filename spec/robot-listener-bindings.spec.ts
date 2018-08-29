// tslint:disable:max-classes-per-file

import { bootstrapModule, HubularModule } from '../lib';
import { Response, Robot } from 'hubot';
import { RobotHear } from '../lib/src/robot-hear.decorator';
import { RobotMock } from './robot-mock';
import { RobotRespond } from '../lib/src/robot-respond.decorator';

let robotMock: RobotMock;

beforeEach(() => {
    robotMock = new RobotMock();
});

afterEach(() => {
    robotMock.dispose();
});

export default describe('Robot Bindings', () => {
    it('@RobotHear should bind to robot.hear()', () => {

        const expected = 'pong';
        @HubularModule()
        class AppModule {

            @RobotHear(/ping/i)
            protected onPing(res: Response<Robot<any>>) {
                res.send(expected);
            }
        }

        bootstrapModule(AppModule)(robotMock.robot);

        return robotMock
            .sendMessage('ping')
            .onSend((envelop, msgs) => {
                const answer = msgs[0];

                expect(answer).toEqual(expected);
            });
    });

    it('@RobotRespond should bind to robot.respond()', () => {

        const expected = 'pong';
        @HubularModule()
        class AppModule {

            @RobotRespond(/ping/i)
            protected onPing(res: Response<Robot<any>>) {
                res.send(expected);
            }
        }

        bootstrapModule(AppModule)(robotMock.robot);

        return robotMock
            .sendMessage('hubot ping')
            .onSend((envelop, msgs) => {
                const answer = msgs[0];

                expect(answer).toEqual(expected);
            });
    });

});
