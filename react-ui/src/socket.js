import { io } from 'socket.io-client'

const URL = 'http://localhost:2023';

export const socket = io(URL);