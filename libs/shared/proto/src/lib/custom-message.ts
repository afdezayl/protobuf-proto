import { Field, Message } from 'protobufjs/light';

export class CustomMessage extends Message<CustomMessage> {
  @Field.d(1, 'string', 'required')
  text: string;
}
