import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Type } from '@angular/core';
import { Message } from 'protobufjs';
import { Observable } from 'rxjs';
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

@Injectable({
  providedIn: 'root',
})
export class ProtobufHttpClientService {
  private arraybufferHeader = new HttpHeaders({
    'Content-type': 'application/octet-stream',
  });
  // eslint-disable-next-line @typescript-eslint/ban-types
  private arraybufferTypeOption: object = {
    responseType: HttpResponseType.ArrayBuffer,
  };

  constructor(private http: HttpClient) {}

  get<T extends Message<T>>(
    responseType: Type<T>,
    path: string
  ): Observable<T> {
    return this.http
      .get<ArrayBuffer>(path, { ...this.arraybufferTypeOption })
      .pipe(map((buffer) => this._decode(buffer, responseType)));
  }

  post<T extends Message<T>, U extends Message<U>>(
    responseType: Type<T>,
    path: string,
    body: U | null
  ): Observable<T> {
    const encodedMessage = this._encode(body);

    return this.http
      .post<ArrayBuffer>(path, encodedMessage, {
        ...this.arraybufferTypeOption,
        headers: this.arraybufferHeader,
      })
      .pipe(map((buffer) => this._decode(buffer, responseType)));
  }

  /**
   *
   * @param obj A protobuf message
   */
  private _encode<T extends Message<T>>(obj: T | null): ArrayBuffer | null {
    if (obj === null) {
      return null;
    }

    const type = obj.$type;
    const encoded = type.encode(obj).finish();

    // httpClient doesn't convert to string arraybuffer or blob.
    return encoded.buffer.slice(
      encoded.byteOffset,
      encoded.byteOffset + encoded.length
    );
  }

  private _decode<T extends Message<T>>(buffer: ArrayBuffer, type: Type<T>): T {
    const uint8 = new Uint8Array(buffer);
    const decoded = new type().$type.decode(uint8);

    return decoded as T;
  }
}
