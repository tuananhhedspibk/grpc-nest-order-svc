import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import {
  DecreaseStockResponse,
  FindOneResponse,
  PRODUCT_SERVICE_NAME,
  ProductServiceClient,
} from './proto/product.pb';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { Repository } from 'typeorm';
import { CreateOrderRequest, CreateOrderResponse } from './proto/order.pd';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrderService implements OnModuleInit {
  private productSvc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(Order)
  private readonly repository: Repository<Order>;

  public onModuleInit() {
    this.productSvc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  public async createOrder(
    data: CreateOrderRequest,
  ): Promise<CreateOrderResponse> {
    console.log('data', data);
    const product: FindOneResponse = await firstValueFrom(
      this.productSvc.findOne({ id: data.productId }),
    );

    if (product.status >= HttpStatus.NOT_FOUND) {
      return { id: null, error: ['Product not found'], status: product.status };
    } else if (product.data.stock < data.quantity) {
      return {
        id: null,
        error: ['Stock too less'],
        status: HttpStatus.CONFLICT,
      };
    }

    const order: Order = new Order();

    order.price = product.data.price;
    order.product_id = product.data.id;
    order.user_id = data.userId;

    await this.repository.save(order);

    const decreasedStockData: DecreaseStockResponse = await firstValueFrom(
      this.productSvc.decreaseStock({ id: data.productId, orderId: order.id }),
    );

    if (decreasedStockData.status === HttpStatus.CONFLICT) {
      await this.repository.delete(order.id);

      return {
        id: null,
        error: decreasedStockData.error,
        status: HttpStatus.CONFLICT,
      };
    }

    return { id: order.id, error: null, status: HttpStatus.OK };
  }
}
