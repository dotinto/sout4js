declare namespace sout4js {
    interface Flags {
        flags: "w" | string;
    }

    function logger(logsPath: string, flags?: Flags): void;
    function trace(message: string): void;
    function debug(message: string): void;
    function info(message: string): void;
    function warn(message: string): void;
    function error(message: string): void;
    function fatal(message: string): void;
    
    function traceAdv(message: string, thread: string, module: string, useLegacyMethod: boolean = true): void;
    function debugAdv(message: string, thread: string, module: string, useLegacyMethod: boolean = true): void;
    function infoAdv(message: string, thread: string, module: string, useLegacyMethod: boolean = true): void;
    function warnAdv(message: string, thread: string, module: string, useLegacyMethod: boolean = true): void;
    function errorAdv(message: string, thread: string, module: string, useLegacyMethod: boolean = true): void;
    function fatalAdv(message: string, thread: string, module: string, useLegacyMethod: boolean = true): void;
}

export default sout4js;
