# Hubular

A Framework for writing complex Hubot Bots.

Inspired on Angular. Written in Typescript.

## What is it like?

This is plain Hubot:

```coffee
module.exports = (robot) ->
  robot.hear /badger/i, (res) ->
    res.send "Badgers? BADGERS? WE DON'T NEED NO STINKIN BADGERS"

  robot.respond /open the pod bay doors/i, (res) ->
    res.reply "I'm afraid I can't let you do that."
```

This is Hubular:

```typescript
import { HubularModule, HubularRobot, RobotHear, RobotRespond } from 'hubular';
import { Response } from 'hubot';

@HubularModule()
export class HeroesModule {

    @RobotHear(/badger/)
    protected badgers(res: Response<HubularRobot>) {
        res.send('Badgers? BADGERS? WE DON\'T NEED NO STINKIN BADGERS');
    }

    @RobotRespond(/open the pod bay doors/)
    protected openThePodBayDoors(res: Response<HubularRobot>) {
        res.send('I\'m afraid I can\'t let you do that.');
    }
}
```

Okay.. that's not so impressive..

## Dependency Injection

Behind the hoods, Hubular uses `injection-js` to create a flat injector, you can inject `providers`
into any `@HubularModule()` or `@Injectable()`.

If you are familiar with Angular, this should ring a bell:

```typescript
// door.serivce.ts
import { BRAIN, Injectable, Inject } from 'hubular';
import { Brain } from 'hubot';

@Injectable()
export class DoorService {

    constructor(
        @Inject(BRAIN)
        private brain: Brain) { }

    public tryOpenThePodBayDoors() {
        // TODO: Open the doors, perhaps store status in brain?
        return true;
    }
}

```

```typescript
// door.module.ts
import { HubularModule, HubularRobot, RobotHear } from 'hubular';
import { Response } from 'hubot';
import { DoorService } from './door.service';

@HubularModule({
    providers: [
        // these will be available to all modules
        DoorService
    ]
})
export class DoorModule {

    constructor(
        private door: DoorService,
        // private someOtherService: FromOtherModule
    ) { }

    @RobotHear(/open the pod bay doors/)
    protected openThePodBayDoors(res: Response<HubularRobot>) {
        if (this.door.tryOpenThePodBayDoors()) {
            res.send('The doors have been opened.');
        } else {
            res.send('I\'m afraid I can\'t let you do that.');
        }
    }
}
```

```typescript
// app.module.ts
import { HubularModule } from 'hubular';
import { HeroesModule } from './heroes/heroes.module';

@HubularModule({
    imports: [
        DoorModule
    ]
})
export class AppModule {

    // The AppModule is also resolved using DI
    // although it's only purpose should be to simply import other modules
    // constructor(private door: DoorService) { }
}

```

## Creating new Hubular Projects

You can use Yeoman to scaffold a brand new Hubular App:

```bash
yarn global add generator-hubular
```

```bash
yo hubular
```

If everything goes fine you should have a working Hubular App.
Test it's working with

```bash
yarn start
```

## Adding Hubular to existing Hubot

1. Install Hubular in your Hubot project

    ```bash
    yarn add hubular reflect-metadata
    yarn add --dev typescript
    ```

1. Temporary create a new Hubular project using the previous guide.
   This will get all the latest files for you, copy into your project the `tsconfig.json` and `src/`.

1. Run `tsc`
1. Run Hubot with `--require hubular-scripts`

    ```bash
    bin/hubot --require hubular-scripts
    ```

## Hubular Directory Structure

```text
|   .gitignore
|   external-scripts.json
|   package.json
|   tsconfig.json
|   tslint.json
|   yarn.lock
+---bin
|       hubot
|       hubot.cmd
+---hubular-scripts
+---node_modules
+---scripts
|       .gitkeep
\---src
    |   main.ts
    \---app
        |   app.module.ts
        \---heroes
                heroes.models.ts
                heroes.module.ts
                heroes.service.ts
```

1. `./src` contains all your Typescript source code. The contents of this folder will get
    compiled to `./hubular-scripts`.
1. `./scripts`: You can still use classic Hubot Scripts in Javascript or Coffescript.
