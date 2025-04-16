export class Logger {
    static log(...args: any[]) {
        let first_parameter = args.shift();

        const formatConsoleDate = (date: Date) => {
            const padding = (num: Number) => {
                return num.toString().padEnd(2, '0')
            };

            return `[${padding(date.getHours())}:${padding(date.getMinutes())}:${padding(date.getSeconds())}] `;
        }
        console.log.apply(console, [formatConsoleDate(new Date()) + first_parameter].concat(args));
    }
}
