import { GrpcMethod, GrpcStreamMethod } from '@nestjs/microservices';
import Long from 'long';
import { util, configure } from 'protobufjs';
import { Observable } from 'rxjs';

export const protobufPackage = 'order';

export interface CreateOrderRequest {
  productId: number;
  quantity: number;
  userId: number;
}

export interface CreateOrderResponse {
  status: number;
  error: string[];
  id: number;
}

export const ORDER_PACKAGE_NAME = 'order';

export interface OrderServiceClient {
  createOrder(request: CreateOrderRequest): Observable<CreateOrderResponse>;
}

export interface OrderServiceController {
  createOrder(
    request: CreateOrderRequest,
  ):
    | Promise<CreateOrderResponse>
    | Observable<CreateOrderResponse>
    | CreateOrderResponse;
}

export const OrderServiceControllerMethods = () => {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (constructor: Function) {
    const grpcMethods: string[] = ['createOrder'];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcMethod('OrderService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }

    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(
        constructor.prototype,
        method,
      );
      GrpcStreamMethod('OrderService', method)(
        constructor.prototype[method],
        method,
        descriptor,
      );
    }
  };
};

export const ORDER_SERVICE_NAME = 'OrderService';

if (util.Long !== Long) {
  util.Long = Long as any;
  configure();
}
