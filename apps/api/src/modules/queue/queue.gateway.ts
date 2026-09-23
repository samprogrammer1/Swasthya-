import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
  namespace: 'queue',
})
export class QueueGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger = new Logger(QueueGateway.name);

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to OPD Queue WebSocket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from OPD Queue WebSocket: ${client.id}`);
  }

  @SubscribeMessage('subscribe_queue')
  handleSubscribeQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { doctorId: string },
  ) {
    const room = `queue_room_${data.doctorId}`;
    client.join(room);
    this.logger.log(`Client ${client.id} subscribed to room ${room}`);
    return { event: 'subscribed', room };
  }

  @SubscribeMessage('unsubscribe_queue')
  handleUnsubscribeQueue(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { doctorId: string },
  ) {
    const room = `queue_room_${data.doctorId}`;
    client.leave(room);
    this.logger.log(`Client ${client.id} unsubscribed from room ${room}`);
    return { event: 'unsubscribed', room };
  }

  broadcastQueueUpdate(doctorId: string, eventName: string, payload: any) {
    const room = `queue_room_${doctorId}`;
    if (this.server) {
      this.server.to(room).emit(eventName, payload);
      this.logger.log(`Broadcasted ${eventName} to room ${room}`);
    }
  }
}
