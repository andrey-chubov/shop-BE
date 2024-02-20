import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { UserDocument } from '../users/model/user-model';
import {
  WRONG_AMOUNT_PRODUCTS,
  WRONG_PRODUCT,
  WRONG_USER,
} from '../../shared/errors/errorMessages';
import config from '../../config';
import { UpdateCartDto } from './dto/updateCart.dto';
import { LocalCartType } from '../../shared/types/localCartType';
import { CartType } from '../../shared/types/cartType';
import { UsersService } from '../users/users.service';
import { ProductsService } from '../product/products.service';

@Injectable()
export class CartsService {
  private logger = new Logger('CartsService');

  constructor(
    private readonly userService: UsersService,
    private readonly productService: ProductsService,
  ) {}

  async toggleUserCarts(id: string, productId: string): Promise<UserDocument> {
    const currentUser = await this.userService.findUserById(id);

    if (!currentUser) {
      throw new NotFoundException(WRONG_USER);
    }

    const currentProduct = await this.productService.getProductById(productId);

    if (!currentProduct) {
      throw new BadRequestException(WRONG_PRODUCT);
    }

    if (
      currentUser.carts.some(item => item.productId.toString() === productId)
    ) {
      const indexToDelete = currentUser.carts.findIndex(
        item => item.productId.toString() === productId,
      );
      currentUser.carts.splice(indexToDelete, 1);
      this.logger.log(
        `${currentUser.email} delete from carts  this product ${productId}`,
      );

      return await this.userService.updateUser(id, currentUser);
    }

    currentUser.carts.push({
      productId: new mongoose.Types.ObjectId(productId),
      cost: currentProduct.cost,
      amount: config.defaultAmountProductInCart,
    });
    this.logger.log(`${currentUser.email} add in carts product ${productId}`);
    return await this.userService.updateUser(id, currentUser);
  }

  async incrementAmountProductInCart(
    id: string,
    productId: string,
  ): Promise<UserDocument> {
    const currentUser = await this.userService.findUserById(id);

    if (!currentUser) {
      throw new BadRequestException(WRONG_USER);
    }

    const currentProduct = await this.productService.getProductById(productId);

    if (!currentProduct) {
      throw new BadRequestException(WRONG_PRODUCT);
    }

    const productInCart = currentUser.carts.find(
      item => item.productId.toString() === productId,
    );

    const indexToDelete = currentUser.carts.findIndex(
      item => item.productId.toString() === productId,
    );

    if (!productInCart) {
      throw new BadRequestException(WRONG_PRODUCT);
    }

    if (currentProduct.amount <= productInCart.amount) {
      throw new BadRequestException(WRONG_AMOUNT_PRODUCTS);
    }

    const newAmount = productInCart.amount + 1;

    currentUser.carts.splice(indexToDelete, 1, {
      ...productInCart,
      amount: newAmount,
      productId: currentProduct._id,
      cost: currentProduct.cost,
    });
    this.logger.log(
      `${currentUser.email} increment amount ${productId} in carts `,
    );

    return await this.userService.updateUser(id, currentUser);
  }

  async decrementAmountProductInCart(
    id: string,
    productId: string,
  ): Promise<UserDocument> {
    const currentUser = await this.userService.findUserById(id);

    if (!currentUser) {
      throw new BadRequestException(WRONG_USER);
    }

    const currentProduct = await this.productService.getProductById(productId);

    if (!currentProduct) {
      throw new BadRequestException(WRONG_PRODUCT);
    }

    const productInCart = currentUser.carts.find(
      item => item.productId.toString() === productId,
    );

    const indexToDelete = currentUser.carts.findIndex(
      item => item.productId.toString() === productId,
    );

    if (!productInCart) {
      throw new BadRequestException(WRONG_PRODUCT);
    }

    const newAmount = productInCart.amount - 1;

    !newAmount
      ? currentUser.carts.splice(indexToDelete, 1)
      : currentUser.carts.splice(indexToDelete, 1, {
          ...productInCart,
          amount: newAmount,
          productId: currentProduct._id,
          cost: currentProduct.cost,
        });
    this.logger.log(
      `${currentUser.email} decrement amount  or delete ${productId} from carts `,
    );
    return await this.userService.updateUser(id, currentUser);
  }

  async clearCart(id: string): Promise<UserDocument> {
    const currentUser = await this.userService.findUserById(id);

    if (!currentUser) {
      throw new BadRequestException(WRONG_USER);
    }

    currentUser.carts.splice(0);
    this.logger.log(`${currentUser.email} delete all products from carts `);
    return await this.userService.updateUser(id, currentUser);
  }

  async updateCart(
    id: string,
    updateCart: UpdateCartDto,
  ): Promise<UserDocument> {
    const localCarts = updateCart.carts;
    const currentUser = await this.userService.findUserById(id);
    if (!currentUser) {
      throw new BadRequestException(WRONG_USER);
    }
    const userCarts = currentUser.carts;
    localCarts.length >= userCarts.length
      ? (currentUser.carts = await this.mergingUserCarts(userCarts, localCarts))
      : (currentUser.carts = await this.mergingUserCarts(
          localCarts,
          userCarts,
        ));
    this.logger.log(`Synchronyse carts user: ${currentUser.email}`);
    return await this.userService.updateUser(id, currentUser);
  }

  async mergingUserCarts(
    smallCart: LocalCartType[] | CartType[],
    bigCart: LocalCartType[] | CartType[],
  ): Promise<CartType[]> {
    const newUserCarts = [];
    for (const itemBasket of bigCart) {
      const currentProduct = await this.productService.getProductById(
        itemBasket.productId.toString(),
      );
      let newAmount = 0;

      if (!currentProduct) {
        throw new BadRequestException(WRONG_PRODUCT);
      }

      if (currentProduct.amount === 0 || itemBasket.amount === 0) {
        continue;
      }

      if (
        smallCart.some(
          (item: LocalCartType | CartType) =>
            item.productId.toString() === itemBasket.productId.toString(),
        )
      ) {
        const indexToUpdate = smallCart.findIndex(
          (item: LocalCartType | CartType) =>
            item.productId.toString() === itemBasket.productId.toString(),
        );
        newAmount = smallCart[indexToUpdate].amount + itemBasket.amount;
        smallCart.splice(indexToUpdate, 1);
        const product = await this.getProductWithNewAmount(
          itemBasket.productId.toString(),
          newAmount,
        );
        newUserCarts.push(product);
      } else {
        const product = await this.getProductWithNewAmount(
          itemBasket.productId.toString(),
          itemBasket.amount,
        );

        newUserCarts.push(product);
      }
    }
    if (smallCart.length !== 0) {
      for (const item of smallCart) {
        const product = await this.getProductWithNewAmount(
          item.productId.toString(),
          item.amount,
        );

        newUserCarts.push(product);
      }
    }

    return newUserCarts;
  }

  async getProductWithNewAmount(id: string, amount: number): Promise<CartType> {
    const currentProduct = await this.productService.getProductById(id);
    if (!currentProduct) {
      throw new BadRequestException(WRONG_PRODUCT);
    }

    if (amount > currentProduct.amount)
      return {
        productId: currentProduct._id,
        amount: currentProduct.amount,
        cost: currentProduct.cost,
      };

    return {
      productId: currentProduct._id,
      amount: amount,
      cost: currentProduct.cost,
    };
  }
}
