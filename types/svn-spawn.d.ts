declare module 'svn-spawn' {
    import { EventEmitter } from 'events';

    interface SvnOptions {
        cwd?: string;
        noAuthCache?: boolean;
        username?: string;
        password?: string;
        [key: string]: any;
    }

    export default class Svn extends EventEmitter {
        constructor(options?: SvnOptions);

        cmd(
            command: string,
            args: string[],
            callback: (err: Error | null, data: string) => void
        ): void;

        update(callback: (err: Error | null, data: string) => void): void;

        checkout(
            repo: string,
            targetPath: string,
            callback: (err: Error | null, data: string) => void
        ): void;

        // Add more methods as needed...
    }
}
