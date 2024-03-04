import mitt from 'mitt';

const emitter = mitt();

export const emit = emitter.emit;
export const on = emitter.on;
export const off = emitter.off;

export default emitter;