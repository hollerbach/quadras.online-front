// src/app/shared/validators/email.validator.ts
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function emailValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // Se o campo estiver vazio, não valida, pois a verificação de "required" pode ser feita separadamente.
      return null;
    }
    // Expressão regular para validação básica de e-mail.
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const valid = emailRegex.test(control.value);
    return valid ? null : { emailInvalid: true };
  };
}
