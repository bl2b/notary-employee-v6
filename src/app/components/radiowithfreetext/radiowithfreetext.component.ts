import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { DescriptifGroupFieldAnswerDto } from '../../_shared/model/descriptifGroupFieldAnswerDto';

@Component({
  selector: 'app-radiowithfreetext',
  templateUrl: './radiowithfreetext.component.html',
  styleUrls: ['./radiowithfreetext.component.scss']
})
export class RadiowithfreetextComponent implements OnInit {

  @Input() field: FormGroup;
  customAnswer: FormGroup;

  constructor(private _fb: FormBuilder) { }

  ngOnInit() {
    console.log('ngoninitradio');
    this.customAnswer = this._fb.group({
      Data: '',
      Data_DE: '',
      Data_EN: '',
      Data_FR: '',
      Data_NL: '',
      IsSelected: '',
      parentId: '',
      groupId: '',
      fieldId: '',
    });

    const answers = this.getAnswers(this.field);

    if (answers.length > 0) {
      const customAns: any = answers.find((ans: any) => {
        return ans.value.IsSelected == true;
      });
      if (customAns) {
        if (this.isCustom(customAns.value.Data_FR)) {
          this.customAnswer.patchValue({
            Data: customAns.value.Data,
            Data_DE: customAns.value.Data_DE,
            Data_EN: customAns.value.Data_EN,
            Data_FR: customAns.value.Data_FR,
            Data_NL: customAns.value.Data_NL,
            IsSelected: customAns.value.IsSelected
          });

          const options = this.getDefaultAnswers(this.field);
          options.push(this._fb.group({
            Data: this.customAnswer.get('Data').value,
            Data_DE: this.customAnswer.get('Data_DE').value,
            Data_EN: this.customAnswer.get('Data_EN').value,
            Data_FR: this.customAnswer.get('Data_FR').value,
            Data_NL: this.customAnswer.get('Data_NL').value,
            IsSelected: false,
            IsCustom: true
          }))
        }
      }
    }
  }

  // openDialog() {
    // console.log('openDialog');
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogConfig.data = {
    //   form: this.customAnswer.value,
    //   title: this.field.value.Label
    // }

    // const dialogRef = this.dialog.open(CreateoptionComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //   (data) => { 
    //     console.log('afterClosed');
    //     this.customAnswer.get('Data').setValue(data.Data);
    //     this.customAnswer.get('Data_DE').setValue(data.Data_DE);
    //     this.customAnswer.get('Data_EN').setValue(data.Data_EN);
    //     this.customAnswer.get('Data_FR').setValue(data.Data_FR);
    //     this.customAnswer.get('Data_NL').setValue(data.Data_NL);
    //     this.pushCustomInDefaultAnswer();
    //   });
  // }

  isCustom(dataFr: string): boolean {
    console.log('isCustom');
    const answers = this.getDefaultAnswers(this.field);
    var result = answers.find((item) => {
      return item.value.Data_FR == dataFr;
    });
    return Boolean(result) == false;
  }

  getAnswers(form) {
    console.log('getAnswers');
    return (form.get('Answers') as FormArray).controls;
  }

  getDefaultAnswers(form) {
    console.log('getDefaultAnswers');
    return (form.get('DefaultAnswers') as FormArray).controls;
  }

  open(content) {
    // console.log('open');
    // this._modalService.open(content, { size: 'sm' }).result.then((result) => {
    //   //console.log(`Closed with: ${result}`);
    // }, (reason) => {
    //   //console.log(`Dismissed ${this.getDismissReason(reason)}`);
    // });
  }

  done() {
    console.log('done');
    if (Boolean(this.customAnswer.get('Data_FR').value)) {
      this.pushCustomInDefaultAnswer();
    }
  }

  delete() {
    console.log('delete');
    var customOption = this.field.value.DefaultAnswers.find((ans: any) => {
      return ans.IsCustom == true;
    });

    if (customOption) {
      this.field.value.DefaultAnswers.pop();
      var ans = this.field.value.Answers.find((ans: any) => {
        return true;
      });
      ans.Data = '';
      ans.Data_DE = '';
      ans.Data_EN = '';
      ans.Data_FR = '';
      ans.Data_NL = '';
      ans.IsSelected = false;

      this.customAnswer.get('Data').setValue('');
      this.customAnswer.get('Data_DE').setValue('');
      this.customAnswer.get('Data_EN').setValue('');
      this.customAnswer.get('Data_FR').setValue('');
      this.customAnswer.get('Data_NL').setValue('');
    }
  }

  pushCustomInDefaultAnswer() {
    console.log('pushCustomInDefaultAnswer');
    var customOption = this.field.value.DefaultAnswers.find((ans: any) => {
      return ans.IsCustom == true;
    });

    if (customOption) {
      customOption.Data = this.customAnswer.get('Data').value;
      customOption.Data_DE = this.customAnswer.get('Data_DE').value;
      customOption.Data_EN = this.customAnswer.get('Data_EN').value;
      customOption.Data_FR = this.customAnswer.get('Data_FR').value;
      customOption.Data_NL = this.customAnswer.get('Data_NL').value;
    } else {

      // this.field.value.DefaultAnswers.push({
      //   Data: this.customAnswer.get('Data').value,
      //   Data_DE: this.customAnswer.get('Data_DE').value,
      //   Data_EN: this.customAnswer.get('Data_EN').value,
      //   Data_FR: this.customAnswer.get('Data_FR').value,
      //   Data_NL: this.customAnswer.get('Data_NL').value,
      //   IsSelected: false,
      //   IsCustom: true
      // });

      this.field.value.DefaultAnswers(this.createAnswer(this.customAnswer.value));
    }

    //var ans = this.getAnswers(this.field)
    //ans[0].setValue(this.customAnswer.value); 
  }

  private createAnswer(aswer: DescriptifGroupFieldAnswerDto): FormGroup {
    return this._fb.group({
      Data: aswer.Data || '',
      Data_DE: aswer.Data_DE || '',
      Data_EN: aswer.Data_EN || '',
      Data_FR: aswer.Data_FR || '',
      Data_NL: aswer.Data_NL || '',
      IsSelected: aswer.IsSelected || ''
    });
  }

  getOptions(defAnswers: DescriptifGroupFieldAnswerDto[]): Array<any> {
    console.log('getOptions');
    let returnArr = [];
    if (defAnswers) {
      defAnswers.forEach((answer) => {
        returnArr.push({ value: answer, label: answer.Data });
      });
    }
    return returnArr;
  }

}
