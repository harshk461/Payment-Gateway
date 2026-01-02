import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CreateCardDto } from './dto/create-card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Post()
  async createCard(@Body(ValidationPipe) createCardDto: CreateCardDto) {
    const card = await this.cardService.generateCard(createCardDto);

    return {
      success: true,
      message: 'Card issued successfully',
      card: {
        id: card.id,
        cardNumber: card.cardNumber.replace(/(\d{4})/g, '$1 ').trim(),
        last4: card.cardNumber.slice(-4),
        expiryMonth: String(card.expiryMonth).padStart(2, '0'),
        expiryYear: String(card.expiryYear).slice(-2),
        cvv: '***', // Never return CVV to frontend
        network: card.network,
        cardholderName: card.cardholderName,
        dailyLimit: card.dailyLimit,
        status: card.status,
      },
    };
  }

  @Get()
  async getAllCards() {
    return this.cardService.getAllCards();
  }

  @Get(':id')
  async getCardDetail(@Param('id') id: string) {
    return this.cardService.getCardById(id);
  }
}
