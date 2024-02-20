import { UpdateCartDto } from '../../src/modules/carts/dto/updateCart.dto';
import InjectionFixtureBuilder from '../../src/shared/utils/injectionFixtureBuilder';

export class UpdateCartDtoBuilder {
  public static defaultAll(): InjectionFixtureBuilder<UpdateCartDto> {
    return new InjectionFixtureBuilder(new UpdateCartDto()).with({
      carts: [
        {
          productId: '63c6867b5af7f0e50eddd38f',
          amount: 1,
        },
        {
          productId: '5eb6e7e7e9b7f4194e000001',
          amount: 1,
        },
      ],
    });
  }
}
