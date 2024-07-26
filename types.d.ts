declare namespace sout4js {
    type Flags = object;

    function logger(logsPath: string, flags: Flags): void;
    function trace(message: string): void;
    function debug(message: string): void;
    function info(message: string): void;
    function warn(message: string): void;
    function error(message: string): void;

    function fatal(message: string): void;
    function traceAdv(message: string, thread: string, module: string): void;
    function debugAdv(message: string): void;
    function infoAdv(message: string): void;
    function warnAdv(message: string): void;
    function errorAdv(message: string): void;
    function fatalAdv(message: string): void;
}

export default sout4js;