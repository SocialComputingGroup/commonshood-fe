import io from 'socket.io-client';

import config from '../../config';

const socket = io(config.network.socketserver['url']);

export default socket;