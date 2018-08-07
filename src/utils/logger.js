/**
 * Proxy around the console object to allow for mocking during tests and
 * checking if the relevant console methods exist. If one doesn't, it falls
 * back to console.log.
 */
export default {
    log: console.log.bind(console),
    info: console.info ? console.info.bind(console) : console.log.bind(console),
    warn: console.warn ? console.warn.bind(console) : console.log.bind(console),
    error: console.error ? console.error.bind(console) : console.log.bind(console),
};
