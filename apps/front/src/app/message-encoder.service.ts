import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CustomMessage } from '@protobuf-proto/shared/proto';
import { Message } from 'protobufjs';
import { map } from 'rxjs/operators';

export class HttpResponseType {
  static readonly JSON = 'json';
  static readonly ArrayBuffer = 'arraybuffer' as 'json';
  static readonly Blob = 'blob' as 'json';
  static readonly Text = 'text' as 'json';
}

export class HttpObserve {
  static readonly Body = 'body';
  static readonly Events = 'events' as 'body';
  static readonly Response = 'response' as 'body';
}

// eslint-disable-next-line @typescript-eslint/ban-types
const arraybufferTypeOption: object = {
  responseType: HttpResponseType.ArrayBuffer,
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
    const message = new CustomMessage({ text: 'hello world' });
    const encoded = this._encode(message);

    return this.http
      .post<ArrayBuffer>('/api/echo', encoded, {
        ...arraybufferTypeOption,
        headers: arraybufferHeader(encoded.byteLength),
      })
      .pipe(map((x) => CustomMessage.decode(new Uint8Array(x))));
  }

  /**
   *
   * @param obj A protobuf message
   */
  private _encode<T extends Message<T>>(obj: T): ArrayBuffer {
    const type = obj.$type;
    const encoded = type.encode(obj).finish();

    // httpClient doesn't convert to string arraybuffer or blob. Limit size to avoid decode errors and big payload.
    return encoded.buffer.slice(
      encoded.byteOffset,
      encoded.byteOffset + encoded.length
    );
  }
}
