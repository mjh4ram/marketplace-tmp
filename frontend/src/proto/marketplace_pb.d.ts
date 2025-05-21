// package: marketplace
// file: marketplace.proto

import * as jspb from "google-protobuf";

export class StatusResponse extends jspb.Message {
  getStatus(): string;
  setStatus(value: string): void;

  getMessage(): string;
  setMessage(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StatusResponse): StatusResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StatusResponse;
  static deserializeBinaryFromReader(message: StatusResponse, reader: jspb.BinaryReader): StatusResponse;
}

export namespace StatusResponse {
  export type AsObject = {
    status: string,
    message: string,
    timestamp: number,
  }
}

export class ErrorResponse extends jspb.Message {
  getCode(): ErrorCodeMap[keyof ErrorCodeMap];
  setCode(value: ErrorCodeMap[keyof ErrorCodeMap]): void;

  getMessage(): string;
  setMessage(value: string): void;

  getDetailsMap(): jspb.Map<string, string>;
  clearDetailsMap(): void;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ErrorResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ErrorResponse): ErrorResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ErrorResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ErrorResponse;
  static deserializeBinaryFromReader(message: ErrorResponse, reader: jspb.BinaryReader): ErrorResponse;
}

export namespace ErrorResponse {
  export type AsObject = {
    code: ErrorCodeMap[keyof ErrorCodeMap],
    message: string,
    detailsMap: Array<[string, string]>,
  }
}

export interface ErrorCodeMap {
  ERROR_INTERNAL: 0;
  ERROR_NOT_IMPLEMENTED: 1;
  ERROR_SERVICE_UNAVAILABLE: 2;
  ERROR_INVALID_REQUEST: 3;
  ERROR_INVALID_CONTENT_TYPE: 4;
  ERROR_VALIDATION: 5;
  ERROR_UNAUTHORIZED: 6;
  ERROR_FORBIDDEN: 7;
  ERROR_NOT_FOUND: 8;
  ERROR_ALREADY_EXISTS: 9;
  ERROR_RESOURCE_CONFLICT: 10;
}

export const ErrorCode: ErrorCodeMap;

