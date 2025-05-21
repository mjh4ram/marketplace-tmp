package middleware

import (
	"io"
	"net/http"
	"reflect"

	"google.golang.org/protobuf/proto"
	mpb "marketplace/proto"  // alias the proto package to avoid conflict
)

// ProtoHandler is a type that represents our handler functions that work with proto types
type ProtoHandler[Req proto.Message, Resp proto.Message] func(r *http.Request, req Req) (Resp, *mpb.ErrorResponse, int)

// ProtoMiddleware creates a middleware that handles proto conversion for a specific handler
func ProtoMiddleware[Req proto.Message, Resp proto.Message](handler ProtoHandler[Req, Resp]) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// Create a new instance of the request type
			reqType := reflect.TypeOf((*Req)(nil)).Elem()
			req := reflect.New(reqType).Interface().(Req)

			// Read and unmarshal the request body
			body, err := io.ReadAll(r.Body)
			if err != nil {
				writeProtoError(w, http.StatusBadRequest, &mpb.ErrorResponse{
					Code:    mpb.ErrorCode_ERROR_INVALID_REQUEST,
					Message: "Failed to read request body",
				})
				return
			}
			defer r.Body.Close()

			if err := proto.Unmarshal(body, req); err != nil {
				writeProtoError(w, http.StatusBadRequest, &mpb.ErrorResponse{
					Code:    mpb.ErrorCode_ERROR_INVALID_REQUEST,
					Message: "Failed to parse request body",
				})
				return
			}

			// Call the handler
			resp, errResp, status := handler(r, req)
			if errResp != nil {
				writeProtoError(w, status, errResp)
				return
			}

			// Marshal and write the response
			data, err := proto.Marshal(resp)
			if err != nil {
				writeProtoError(w, http.StatusInternalServerError, &mpb.ErrorResponse{
					Code:    mpb.ErrorCode_ERROR_INTERNAL,
					Message: "Failed to marshal response",
				})
				return
			}

			w.Header().Set("Content-Type", "application/x-protobuf")
			w.WriteHeader(status)
			w.Write(data)
		})
	}
}

// writeProtoError writes a proto error response
func writeProtoError(w http.ResponseWriter, status int, err *mpb.ErrorResponse) {
	data, _ := proto.Marshal(err)
	w.Header().Set("Content-Type", "application/x-protobuf")
	w.WriteHeader(status)
	w.Write(data)
} 