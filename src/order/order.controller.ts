import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { OrderService } from './order.service';
import { CreateOrderResponse, ORDER_SERVICE_NAME } from './proto/order.pd';
import { CreateOrderRequestDto } from './order.dto';

@Controller()
export class OrderController {
  @Inject(OrderService)
  private readonly service: OrderService;

  @GrpcMethod(ORDER_SERVICE_NAME, 'CreateOrder')
  private async createOrder(
    data: CreateOrderRequestDto,
  ): Promise<CreateOrderResponse> {
    return this.service.createOrder(data);
  }
}
