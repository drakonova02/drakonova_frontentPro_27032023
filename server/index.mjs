import fastify              from 'fastify'
import fastifyCors          from '@fastify/cors';
import fastifyStatic        from '@fastify/static';
import path                 from 'path';
import { WebSocketServer }  from 'ws';
import { fileURLToPath }    from 'url';
import { request }          from 'http';

const webSocketServer  = new WebSocketServer({ port: 5556 });
const __filename       = fileURLToPath(import.meta.url);
const __dirname        = path.dirname(__filename);
const server           = fastify({logger: true});

webSocketServer.on('connection', (client) => {
    console.log('*****NEW USER*****');

    client.on('message', data => {
        webSocketServer.clients.forEach(customer => {
            if(customer !== webSocketServer) {
                const time = new Date().toLocaleTimeString('en-US');
                customer.send(`[${time}] ${data}`);
            }
        });
    });

    client.on('close', () => {
        console.log('****USER LEFT*****');
    });
})

server.register(fastifyCors);

server.register(fastifyStatic, {
    root: path.join(__dirname, '../client'),
})

server.listen({port: 5555})
.then(() => {
    console.log('success');
})
.catch(err => {
    console.log(err)
})