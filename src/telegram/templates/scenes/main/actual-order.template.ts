import { Markup } from 'telegraf';
import { Template } from '../../template';
import { Order } from '../../../../modules/order/entity/order.entity';
import * as moment from 'moment';
import { OrderItem } from '../../../../modules/order/entity/order-item.entity';
import { Flight } from '../../../../modules/order/entity/flight.entity';

export class ActualOrderTemplate extends Template {
  static CONFIRM_BTN_CB_DATA_PREFIX = `CNF_AO`;

  constructor(private readonly order: Order) {
    super();
  }

  getMessageText(): string {
    let msg = '‼️ Актуальный наряд на ';
    msg += moment(new Date()).format('HH:mm DD.MM.YYYY');
    msg += ' ‼️ \n \n';
    const now = Date.now();
    this.order.items.forEach((item: OrderItem) => {
      const iconItem = this.getItemIcon(item);
      const departure = moment(item.departure).format('HH:mm DD.MM');
      const arrival = moment(item.arrival).format('HH:mm DD.MM');
      const airplane =
        item.flights.length >= 2 ? `✈️ ${item.flights[0].airplane} \n` : `\n`;

      if (now > item.arrival.getTime()) msg += '<s>';
      msg += `<b>${iconItem} ${item.route} </b> \n`;
      msg += `<i>🛫 ${departure}</i>  `;
      msg += `<i>🛬 ${arrival}</i> \n`;
      msg += `📑 ${item.description} \n \n`;
      msg += airplane;

      item.flights.forEach((flight: Flight) => {
        msg += `- ${flight.flightNumber.replace('AFL', 'SU')}\n`;
      });
      if (now > item.arrival.getTime()) msg += '</s>';
      msg += '\n';
    });
    return msg;
  }

  //todo добавить отпуска и офиc
  private getItemIcon(item: OrderItem): string {
    if (item.flights.length > 2) return '🔄';
    else if (item.flights.length === 2) return '↩️';
    else return 'ℹ️';
  }

  getMarkup(): Markup.Markup<any> | undefined {
    // return Markup.inlineKeyboard([
    //   [
    //     Markup.button.callback(
    //       `Подтвердить наряд`,
    //       `${ActualOrderTemplate.CONFIRM_BTN_CB_DATA_PREFIX}:${this.order.id}`,
    //     ),
    //   ],
    // ]);
    return;
  }

  // private hasNonConfirmItems() {
  //   this.order.items.some((item) => item.confirmDate)
  // }
}
