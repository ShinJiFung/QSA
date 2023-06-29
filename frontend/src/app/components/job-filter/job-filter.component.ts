import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import {FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import {map, startWith} from 'rxjs/operators';
import {NgFor, AsyncPipe, NgIf} from '@angular/common';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import { Sample } from 'src/app/interfaces/sample';
import { SampleService } from 'src/app/services/sample.service';
import { JobFilter } from 'src/app/interfaces/filter';
import { JobService } from 'src/app/services/job.service';
import { JobHeader } from 'src/app/interfaces/job_header';
// export interface User {
//   name: string;
// }

@Component({
  selector: 'app-job-filter',
  templateUrl: './job-filter.component.html',
  styleUrls: ['./job-filter.component.css'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    NgFor,
    AsyncPipe,
    NgIf,
  ],
})
export class JobFilterComponent {
  // samples$!: Observable<Sample[]>;
  // private searchTerms = new Subject<string>();
  // constructor(private sampleService: SampleService) { }

  // Push a search term into the observable stream.
  // search(term: string): void {
  //   this.searchTerms.next(term);
  // }

  // ngOnInit(): void {
  //   this.samples$ = this.searchTerms.pipe(
  //     // wait 300ms after each keystroke before considering the term
  //     debounceTime(300),

  //     // ignore new term if same as previous term
  //     distinctUntilChanged(),

  //     // switch to new search observable each time the term changes
  //     switchMap((term: string) => this.sampleService.searchSamples(term)),
  //   );
  // }
  // myControl = new FormControl<string>('');
  options: string[] = [];
  filteredOptions!: Observable<string[]>;
  jobFilter! : FormGroup;
  jobHeaders!: JobHeader[];
  constructor(  private sampleService: SampleService,
                private fb: FormBuilder,
                private jobService: JobService) { }

  ngOnInit() {
    console.log('ngOnInit');
    this.jobFilter = this.fb.group({
      sn: [''],
      date: [''],
      htag: ['']
    });
    this.filteredOptions = this.jobFilter.controls['sn'].valueChanges.pipe(
      startWith(''),
      map((value) => {
        const name = value;
        return name ? this._filter(name as string) : this.options.slice();
      })
    );
  }
  onSubmit({ value, valid }: { value: JobFilter, valid: boolean }) {
    this.jobService.filterJobs(value).subscribe(data => {
      this.jobHeaders = data;
    });
    console.log(value, valid);

    console.log(this.jobHeaders);
  }
  // displayFn(user: string): string {
  //   console.log('displayFn', user);
  //   return user;
  // }

  private _filter(name: string): string[] {
    const filterValue = name.toLowerCase();
    console.log('_filter', filterValue);
    return this.options.filter((option) =>
      option.toLowerCase().includes(filterValue)
    );
  }
}