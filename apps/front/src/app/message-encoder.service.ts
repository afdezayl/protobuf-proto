import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomMessage } from '@protobuf-proto/shared/proto';
import { ProtobufHttpClientService } from './protobuf-http-client.service';

@Injectable({
  providedIn: 'root',
})
export class MessageSenderService {
  constructor(
    private http: HttpClient,
    private protoClient: ProtobufHttpClientService
  ) {}

  jsonGreeting() {
    return this.http.get<CustomMessage>('/api/json');
  }

  getHello() {
    return this.protoClient.get(CustomMessage, '/api/hello');
  }

  sendHello() {
    const message = new CustomMessage({ text: 'hello world' });

    return this.protoClient.post(CustomMessage, '/api/echo', message);
  }
}
