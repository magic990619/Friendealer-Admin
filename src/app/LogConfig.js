const allowLog = true;

export function browserLogMessage(file, method, message) {
    if (allowLog) {
        console.log(" [ " + file + " ] " + " -> " + method + " : " + message);
    }
}
