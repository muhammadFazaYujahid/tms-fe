import { io } from 'socket.io-client';

const socket = io(process.env.SERVER_URL, {
    withCredentials: true,
    extraHeaders: {
        'Content-Type': 'application/json',
        'Control-Allow-Credentials': 'true'
    }
});

export default socket;