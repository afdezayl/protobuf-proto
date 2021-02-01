/* eslint-disable no-restricted-syntax */
import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MessageEncoderService } from './message-encoder.service';

@Component({
  selector: 'protobuf-proto-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.service.sendHello();

  constructor(private service: MessageEncoderService) {}

  getHello() {
    this.service.getHello().subscribe((m) => console.log(m.text));
  }

  sendHello() {
    this.service.sendHello().subscribe();
  }

  sendMultipleHello() {
    console.time('totalTime');
    forkJoin(Array(100).fill(this.service.sendHello()))
      .pipe()
      .subscribe((_) => console.timeEnd('totalTime'));
  }
}
