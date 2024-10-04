import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-torneos',
    templateUrl: './torneos.component.html',
    styleUrls: ['./torneos.component.scss'],
})
export class TorneosComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {
        //refresh the view
        // location.reload();
    }

}
