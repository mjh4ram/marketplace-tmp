// package: marketplace
// file: item.proto

import * as jspb from "google-protobuf";
import * as marketplace_pb from "./marketplace_pb";

export class Item extends jspb.Message {
  getId(): string;
  setId(value: string): void;

  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getPrice(): number;
  setPrice(value: number): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  getCreatedAt(): number;
  setCreatedAt(value: number): void;

  getUpdatedAt(): number;
  setUpdatedAt(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Item.AsObject;
  static toObject(includeInstance: boolean, msg: Item): Item.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Item, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Item;
  static deserializeBinaryFromReader(message: Item, reader: jspb.BinaryReader): Item;
}

export namespace Item {
  export type AsObject = {
    id: string,
    name: string,
    description: string,
    price: number,
    tagsList: Array<string>,
    createdAt: number,
    updatedAt: number,
  }
}

export class ListItemsRequest extends jspb.Message {
  getPageSize(): number;
  setPageSize(value: number): void;

  getPageToken(): number;
  setPageToken(value: number): void;

  getFilter(): string;
  setFilter(value: string): void;

  getSortBy(): string;
  setSortBy(value: string): void;

  getSortDesc(): boolean;
  setSortDesc(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListItemsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: ListItemsRequest): ListItemsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListItemsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListItemsRequest;
  static deserializeBinaryFromReader(message: ListItemsRequest, reader: jspb.BinaryReader): ListItemsRequest;
}

export namespace ListItemsRequest {
  export type AsObject = {
    pageSize: number,
    pageToken: number,
    filter: string,
    sortBy: string,
    sortDesc: boolean,
  }
}

export class ListItemsResponse extends jspb.Message {
  clearItemsList(): void;
  getItemsList(): Array<Item>;
  setItemsList(value: Array<Item>): void;
  addItems(value?: Item, index?: number): Item;

  getTotalCount(): number;
  setTotalCount(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getNextPageToken(): string;
  setNextPageToken(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ListItemsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: ListItemsResponse): ListItemsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ListItemsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ListItemsResponse;
  static deserializeBinaryFromReader(message: ListItemsResponse, reader: jspb.BinaryReader): ListItemsResponse;
}

export namespace ListItemsResponse {
  export type AsObject = {
    itemsList: Array<Item.AsObject>,
    totalCount: number,
    timestamp: number,
    nextPageToken: string,
  }
}

export class CreateItemRequest extends jspb.Message {
  getName(): string;
  setName(value: string): void;

  getDescription(): string;
  setDescription(value: string): void;

  getPrice(): number;
  setPrice(value: number): void;

  clearTagsList(): void;
  getTagsList(): Array<string>;
  setTagsList(value: Array<string>): void;
  addTags(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateItemRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateItemRequest): CreateItemRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateItemRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateItemRequest;
  static deserializeBinaryFromReader(message: CreateItemRequest, reader: jspb.BinaryReader): CreateItemRequest;
}

export namespace CreateItemRequest {
  export type AsObject = {
    name: string,
    description: string,
    price: number,
    tagsList: Array<string>,
  }
}

export class CreateItemResponse extends jspb.Message {
  hasItem(): boolean;
  clearItem(): void;
  getItem(): Item | undefined;
  setItem(value?: Item): void;

  hasStatus(): boolean;
  clearStatus(): void;
  getStatus(): marketplace_pb.StatusResponse | undefined;
  setStatus(value?: marketplace_pb.StatusResponse): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateItemResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreateItemResponse): CreateItemResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CreateItemResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateItemResponse;
  static deserializeBinaryFromReader(message: CreateItemResponse, reader: jspb.BinaryReader): CreateItemResponse;
}

export namespace CreateItemResponse {
  export type AsObject = {
    item?: Item.AsObject,
    status?: marketplace_pb.StatusResponse.AsObject,
  }
}

