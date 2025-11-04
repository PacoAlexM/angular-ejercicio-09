import { AbstractControl, FormArray, FormGroup, ValidationErrors } from '@angular/forms';

async function sleep () {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(true);
        }, 3000)
    });
}

export class FormUtils {
    static namePattern = '^([a-zA-Z]+) ([a-zA-Z]+)$';
    static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
    static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
    static slugPattern = '^[a-z0-9_]+(?:-[a-z0-9_]+)*$';

    static getErrorsInControl(errors: ValidationErrors) {
        for (const key of Object.keys(errors)) {
            switch (key) {
                case 'required':
                    return 'Este campo es requerido';
                case 'minlength':
                    return `Minimo de ${errors['minlength'].requiredLength} caracteres`;
                case 'min':
                    return `Valor minimo de ${errors['min'].min}`;
                case 'email':
                    return 'Debe ingresar un correo electronico valido';
                case 'pattern':
                    if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
                        return 'El correo electronico no es valido';
                    } else if (errors['pattern'].requiredPattern === FormUtils.namePattern) {
                        return 'Debe capturar el nombre y apellido';
                    } else if (errors['pattern'].requiredPattern === FormUtils.notOnlySpacesPattern) {
                        return 'No admite solo espacios en blanco';
                    }
                    return 'Combinacion de caracteres no permitida';
                case 'emailInUse':
                    return 'Este correo electronico ya esta en uso';
                case 'forbiddenUserName':
                    return 'Este nombre de usuario no esta permitido';
                default:
                    return `Error no controlado (${key})`;
            }
        }

        return null;
    }

    static isValidField(form: FormGroup, field: string): boolean | null {
        return (!!form.controls[field].errors && form.controls[field].touched);
    }

    static getFieldError(form: FormGroup, field: string): string | null {
        if (!form.controls[field]) return null;

        const errors = form.controls[field].errors ?? {};

        return FormUtils.getErrorsInControl(errors);
    }

    static isValidFieldInArray(form: FormArray, index: number): boolean | null {
        return (form.controls[index].errors && form.controls[index].touched);
    }

    static getFieldErrorInArray(form: FormArray, index: number): string | null {
        if (form.controls.length === 0) return null;

        const errors = form.controls[index].errors ?? {};

        return FormUtils.getErrorsInControl(errors);
    }

    static areFieldsEquals(fieldMaster: string, field: string) {
        return (formGroup: AbstractControl) => {
            const fieldMasterValue = formGroup.get(fieldMaster)?.value;
            const fieldValue = formGroup.get(field)?.value;

            return fieldMasterValue === fieldValue ? null : { passwordNotEqual: true };
        }
    }

    static async checkingServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
        await sleep();

        const formValue = control.value;

        if (formValue === 'hola@mundo.com') {
            return {
                emailInUse: true,
            }
        }

        return null;
    }

    static notStrider(control: AbstractControl): ValidationErrors | null {
        const formValue = control.value;

        if (formValue === 'strider') {
            return {
                forbiddenUserName: true,
            }
        }

        return null;
    }
}
