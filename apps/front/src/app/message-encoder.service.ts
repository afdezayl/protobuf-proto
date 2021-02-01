import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomMessage } from '@protobuf-proto/shared/proto';
import { map } from 'rxjs/operators';

// eslint-disable-next-line @typescript-eslint/ban-types
const arraybufferTypeOption: object = {
  responseType: 'arraybuffer',
};

const arraybufferHeader = (length) => {
  return new HttpHeaders({
    'Content-type': 'application/octet-stream',
    //'Content-length': length,
  });
};

@Injectable({
  providedIn: 'root',
})
export class MessageEncoderService {
  constructor(private http: HttpClient) {}

  jsonGreeting() {
    return this.http.get<CustomMessage>('/api/json');
  }

  getHello() {
    return this.http
      .get<ArrayBuffer>('/api/hello', {
        ...arraybufferTypeOption,
      })
      .pipe(map((x) => CustomMessage.decode(new Uint8Array(x))));
  }

  sendHello() {
    const message = new CustomMessage({ text: 'hellooo' });
    const encoded = CustomMessage.encode(message).finish();

    // httpClient doesn't convert to string arraybuffer or blob. Limit size to avoid decode errors and big payload.
    const arraybuffer = encoded.buffer.slice(
      encoded.byteOffset,
      encoded.byteOffset + encoded.length
    );

    return this.http
      .post<ArrayBuffer>('/api/echo', arraybuffer, {
        ...arraybufferTypeOption,
        headers: arraybufferHeader(encoded.byteLength),
      })
      .pipe(map((x) => CustomMessage.decode(new Uint8Array(x))));
  }
}

export class HttpResponseType {
  static JSON = 'json';
  static ArrayBuffer = 'arraybuffer' as 'json';
  static Blob = 'blob' as const;
  static Text = 'text' as const;
}

export class HttpObserve {
  Body: 'body' = 'body' as const;
  Events: 'events' = 'events' as const;
  Response: 'response' = 'response' as const;
}
