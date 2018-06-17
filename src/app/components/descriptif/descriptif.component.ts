import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormGroup, FormBuilder, Validators, FormArray, FormControl, AbstractControl } from '@angular/forms';
import { DescriptifService } from '../../services/descriptif.service';
import { EmployeeDto } from '../../_shared/model/employeeDto';
import { DescriptifDto } from '../../_shared/model/descriptifDto';
import { DescriptifGroupDto } from '../../_shared/model/descriptifGroupDto';
import { DescriptifGroupFieldDto } from '../../_shared/model/descriptifGroupFieldDto';
import { DescriptifGroupFieldAnswerDto } from '../../_shared/model/descriptifGroupFieldAnswerDto';

declare var $: any;

@Component({
  templateUrl: './descriptif.component.html',
  styleUrls: ['./descriptif.component.scss']
})
export class DescriptifComponent implements OnInit {
  panelOpenState: boolean = false;
  descriptifForm: FormGroup;
  ReportID: string;
  langId: number = +localStorage.getItem('Language');
  activeIds: string[] = [];

  constructor(private _fb: FormBuilder, private _service: DescriptifService) {
  }

  public itemsList:Object[] = [
    {
        title: 'Collapsible Group Item #1',
        description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.'
    },
     {
        title: 'Collapsible Group Item #2',
        description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.'
    },
     {
        title: 'Collapsible Group Item #3',
        description: 'Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven\'t heard of them accusamus labore sustainable VHS.'
    }
]

  ngOnInit(): void {
    this.descriptifForm = this._fb.group({
      reportId: ['', Validators.required],
      data: this._fb.array([]),
    });

    //this.blockUI.start();
    this._service.getData().subscribe(res => {
      // console.log(res);
      this.ReportID = res.ReportID;
      //this.blockUI.stop();

      this.descriptifForm.patchValue({
        reportId: res.ReportID
      });
      var items = JSON.parse(res.JsonString);
      console.log(items);
      //checking for null Answers
      items.forEach(function (item: any) {
        item.Groups.forEach(function (group: any) {
          group.Fields.forEach(function (field: any) {
            if (field.Answers == null) {
              field.Answers = []; // empty it before pushing data into it...
              field.Answers.push({
                'Data': '',
                'Data_FR': '',
                'Data_NL': '',
                'Data_DE': '',
                'Data_EN': '',
                'IsSelected': false
              });
            }
          });
        });
      });

      this.patchDataArray(items);
      console.log(this.descriptifForm);
    });
    // console.log('ngOnInt');
  }

  patchDataArray(descriptif: any[]) {
    var datas = this.descriptifForm.get('data') as FormArray;
    descriptif.forEach((desc) => {
      datas.push(this.createDescriptif(desc));
    });
  }

  getDescriptif(form): AbstractControl[] {
    // console.log('getDescriptif');
    return (form.get('data') as FormArray).controls;
  }
  getGroups(form): AbstractControl[] {
    // console.log('getGroups');
    return (form.get('Groups') as FormArray).controls;
  }
  getFields(form): AbstractControl[] {
    // console.log('getFields');
    return (form.get('Fields') as FormArray).controls;
  }
  getAnswers(form): AbstractControl[] {
    // console.log('getAnswers');
    return (form.get('Answers') as FormArray).controls;
  }

  saveDescriptif() {
    // console.log('saveDescriptif');
    if (this.descriptifForm.valid === false) {
      // this._toastr.warning('Please fill up required fields.');
      return;
    }

    //this.blockUI.start();
    var items = this.descriptifForm.get('data').value;
    //copying each answers from FR to Data
    items.forEach(function (item: any) {
      item.Groups.forEach(function (group: any) {
        group.Fields.forEach(function (field: any) {
          field.Answers.forEach(function (ans: any) {
            ans.Data_DE = ans.Data_FR;
            ans.Data_EN = ans.Data_FR;
            ans.Data_FR = ans.Data_FR;
            ans.Data_NL = ans.Data_FR;
            ans.Data = ans.Data_FR;
            if (Boolean(ans.Data_FR) && field.Type != 4) {
              ans.IsSelected = true;
            }
          });
          var customOption = field.DefaultAnswers.find((ans: any) => {
            return ans.IsCustom == true;
          });
          if (customOption) {
            field.DefaultAnswers.pop()
          }
        });
      });
    });
    let model: EmployeeDto = { ReportID: this.descriptifForm.get('reportId').value, JsonString: JSON.stringify(items) };
    this._service.saveData(model).subscribe(res => {
      // this._toastr.success('Successfully saved.');
      // this.blockUI.stop();
      // this.activeIds = [];
    });
  }

  edit(group: FormGroup): void {
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogConfig.data = {
    //   group: group.value,
    //   // title: this.field.value.Label
    // }

    // const dialogRef = this.dialog.open(CreategroupComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //   (grp: DescriptifGroupDto) => {
    //     // let grps = desc.get('Groups') as FormArray;
    //     // let flds = grps.controls[0].get('Fields') as FormArray;
    //     // grp.Fields = flds.value;
    //     // console.log(grp);
    //     // grps.push(this.createGroup(grp));

    //     // console.log(this.descriptifForm.value);
    //   });
  }

  delete(group: FormGroup): void {
    console.log('delete');
  }

  openDialog(desc: FormGroup): void {
    // const dialogConfig = new MatDialogConfig();

    // dialogConfig.disableClose = true;
    // dialogConfig.autoFocus = true;

    // dialogConfig.data = {
    //   // form: obj.value,
    //   // title: this.field.value.Label
    // }

    // const dialogRef = this.dialog.open(CreategroupComponent, dialogConfig);

    // dialogRef.afterClosed().subscribe(
    //   (grp: DescriptifGroupDto) => {
    //     let grps = desc.get('Groups') as FormArray;
    //     let flds = grps.controls[0].get('Fields') as FormArray;
    //     grp.Fields = flds.value;
    //     console.log(grp);
    //     grps.push(this.createGroup(grp));

    //     console.log(this.descriptifForm.value);
    //   });
  }

  private createDescriptif(desc: DescriptifDto): FormGroup {
    return this._fb.group({
      Id: desc.Id || '',
      Groups: this.createGroups(desc.Groups),
      Title: this.langId == undefined ? desc.Title : this.langId == 0 ? desc.Title_FR : desc.Title_EN == "" || desc.Title_EN == null ? desc.Title_FR : desc.Title_EN,
      Title_DE: desc.Title_DE || '',
      Title_EN: desc.Title_EN || '',
      Title_FR: desc.Title_FR || '',
      Title_NL: desc.Title_NL || '',
      Type: desc.Type || '',

    });
  }

  private createGroups(groups: DescriptifGroupDto[]): FormArray {
    let groupsArray = this._fb.array([]);
    if (groups) {
      groups.forEach((group) => {
        groupsArray.push(this.createGroup(group));
      });
    }
    return groupsArray;
  }

  private createGroup(group: DescriptifGroupDto): FormGroup {
    return this._fb.group({
      Id: group.Id || '',
      Fields: this.createFields(group.Fields),
      Title: group.Title || this.langId == undefined ? group.Title : this.langId == 0 ? group.Title_FR : group.Title_EN == "" || group.Title_EN == null ? group.Title_FR : group.Title_EN,
      Title_DE: group.Title_DE || '',
      Title_EN: group.Title_EN || '',
      Title_FR: group.Title_FR || '',
      Title_NL: group.Title_NL || '',
      Type: group.Type || '',
      SortOrder: group.SortOrder || 0
    });
  }

  private createFields(fields: DescriptifGroupFieldDto[]): FormArray {
    let fieldsArray = this._fb.array([]);
    if (fields) {
      fields.forEach((field) => {
        fieldsArray.push(this.createField(field));
      });
    }
    return fieldsArray
  }

  private createField(field: DescriptifGroupFieldDto): FormGroup {
    return this._fb.group({
      Answers: this.createAnswers(field.Answers, field.IsMandatory),
      Articles: field.Articles || '',
      Code: field.Code || '',
      DefaultAnswers: this.createAnswers(field.DefaultAnswers),
      Id: field.Id || '',
      IsMandatory: field.IsMandatory || '',
      Label: this.langId == undefined ? field.Label_FR : this.langId == 0 ? field.Label_FR : field.Label_EN == null || field.Label_EN == "" ? field.Label_FR : field.Label_EN,
      LabelShort: field.LabelShort || '',
      Label_DE: field.Label_DE || '',
      Label_EN: field.Label_EN || '',
      Label_FR: field.Label_FR || '',
      Label_NL: field.Label_NL || '',
      ParentID: field.ParentID || '',
      ResultType: field.ResultType || '',
      Type: field.Type || ''
    });
  }

  private createAnswers(answers: DescriptifGroupFieldAnswerDto[], isRequired: boolean = false): FormArray {
    let answersArray = this._fb.array([]);
    if (answers) {
      answers.forEach((aswer) => {
        answersArray.push(this.createAnswer(aswer, isRequired));
      });
    }
    return answersArray
  }

  private createAnswer(aswer: DescriptifGroupFieldAnswerDto, isRequired: boolean = false): FormGroup {
    var ans = this._fb.group({
      Data: aswer.Data || '',
      Data_DE: aswer.Data_DE || '',
      Data_EN: aswer.Data_EN || '',
      Data_FR: aswer.Data_FR || '',
      Data_NL: aswer.Data_NL || '',
      IsSelected: aswer.IsSelected || ''
    });

    if (isRequired) {
      ans.get('Data_FR').setValidators(Validators.required);
      ans.updateValueAndValidity();
    }

    return ans;
  }
  

}
