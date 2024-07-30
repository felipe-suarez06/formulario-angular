//trim-validator.directive.ts

import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl } from '@angular/forms';

@Directive({
  selector: '[trimValidator][ngModel]',
  providers: [{ provide: NG_VALIDATORS, useExisting: TrimValidatorDirective, multi: true }]
})
export class TrimValidatorDirective implements Validator {
  validate(control: AbstractControl): { [key: string]: any } | null {
    const isValid = !control.value || control.value.trim() === control.value;
    return isValid ? null : { 'trimError': true };
  }
}
