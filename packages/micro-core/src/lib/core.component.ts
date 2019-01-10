import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'lib-core',
  template: `
    <p>
      core works!
    </p>
  `,
  styles: []
})
export class CoreComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
