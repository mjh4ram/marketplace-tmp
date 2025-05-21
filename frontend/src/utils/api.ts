// API utility functions for making HTTP requests to the backend

import * as marketplace_pb from '../proto/marketplace_pb';
import * as item_pb from '../proto/item_pb';

const API_BASE_URL = process.env.API_ENDPOINT || 'http://localhost:3001';

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// RClass is the protobuf message class (not instance)
async function fetchProtobuf<T extends {serializeBinary: () => Uint8Array}, R>(
  endpoint: string,
  requestMessage: T,
  ResponseClass: { deserializeBinary: (bytes: Uint8Array) => R },
  method: string = 'POST',
): Promise<R> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers: {
      'Content-Type': 'application/x-protobuf',
      'Accept': 'application/x-protobuf',
    },
    body: requestMessage.serializeBinary(),
  });

  if (!response.ok) {
    // Try to parse error as protobuf, otherwise as text
    let errorDetails = undefined;
    try {
      const buf = new Uint8Array(await response.arrayBuffer());
      errorDetails = marketplace_pb.ErrorResponse.deserializeBinary(buf);
    } catch {
      errorDetails = await response.text();
    }
    throw new ApiError(response.status, 'API request failed', errorDetails);
  }

  const buffer = new Uint8Array(await response.arrayBuffer());
  return ResponseClass.deserializeBinary(buffer);
}

/**
 * API utility methods using protobuf over HTTP
 */
export const api = {
  /**
   * List marketplace items (POST /items/list)
   */
  listItems: async (req: item_pb.ListItemsRequest): Promise<item_pb.ListItemsResponse> => {
    return fetchProtobuf<item_pb.ListItemsRequest, item_pb.ListItemsResponse>(
      '/items/list',
      req,
      item_pb.ListItemsResponse,
      'POST',
    );
  },

  /**
   * Create a new item (POST /items)
   */
  createItem: async (req: item_pb.CreateItemRequest): Promise<item_pb.CreateItemResponse> => {
    return fetchProtobuf<item_pb.CreateItemRequest, item_pb.CreateItemResponse>(
      '/items',
      req,
      item_pb.CreateItemResponse,
      'POST',
    );
  },
};

export default api; 