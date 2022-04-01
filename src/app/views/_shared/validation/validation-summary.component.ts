import { Component, OnInit, Input} from '@angular/core';
import { NgForm, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation-summary',
  templateUrl: './validation-summary.component.html',
  styleUrls: ['./validation-summary.component.css']
})
export class ValidationSummaryComponent implements OnInit {
  @Input() form: NgForm;
  errors: string[] = [];

  constructor() { }

  ngOnInit() {
    if (this.form instanceof NgForm === false) {
      throw new Error('You must supply the validation summary with an NgForm.');
    }
    this.form.statusChanges.subscribe(status => {
      this.resetErrorMessages(null);
      this.generateErrorMessages(this.form.control);
    });
  }

  resetErrorMessages(form: NgForm) {
    if(form!=null) {
      for (var value in form.controls) {
        $('[name="'+ value +'"]').removeClass("is-invalid");
      }
    }

    this.errors.length = 0;
  }

  generateErrorMessagesFromServer(mensajes){
    for (var value in mensajes) {
      //reemplazar el texto del campo [pass] por la etiqueta [Contraseña]
      let texto=mensajes[value].replace("'"+value+"'","'" + $('label[for="'+value+'"]').html() + "'");
      this.errors.push(texto);
      $('label[for="' + value + '"]').next().addClass("is-invalid");
    }
  }
  generateErrorMessages(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(controlName => {
      let control = formGroup.controls[controlName];
      let errors = control.errors;

      if (errors === null || errors.count === 0) {
        return;
      }

      // Handle the 'required' case
      if (errors.required) {
        this.errors.push(`'${controlName}' es requerido`);
      }
      // Handle 'minlength' case
      if (errors.minlength) {
        this.errors.push(`La longitud mínima de '${controlName}' debe ser ${errors.minlength.requiredLength}.`);
      }

      // Handle custom messages.
      if (errors.message){
        this.errors.push(`${controlName} ${errors.message}`);
      }

    });
  }
}
