import { FormControl } from '@angular/forms';
import { Stripe } from '@ionic-native/stripe';

export class CreditcardNumberValidator {
    static checkcreditcardnumber(control: FormControl, stripe: Stripe): any {
        
           return new Promise(resolve => {
        
            debugger;
            // resolves if valid, rejects if invalid
            // we need to resolve in both cases but return error if invalid
             stripe.validateCardNumber(control.value)
             .then(() => {
                 resolve(null);
             })
             .catch(error => {
                 resolve(error.message)
             })
        
              
        
           });
         }
        

}