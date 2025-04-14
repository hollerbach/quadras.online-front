import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EmailValidator {
  static isValid(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      // Se o campo estiver vazio, não valida (a validação 'required' cuidará disso)
      return null;
    }
    
    // Expressão regular para validação de e-mail
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const valid = emailRegex.test(control.value);
    
    return valid ? null : { emailInvalid: true };
  }
}