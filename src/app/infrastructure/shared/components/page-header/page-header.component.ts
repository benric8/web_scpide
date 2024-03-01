import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'

import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, ButtonModule, RippleModule, TooltipModule],
  templateUrl: './page-header.component.html',
  styleUrls: ['./page-header.component.scss']
})

export class PageHeaderComponent {
  @Input() btn:boolean = true;
  @Input() back:string = "/";
  @Input() tip:string="Volver";
  @Input() titulo:string = "";
  @Input() descripcion:string="";
  @Input() desactivarTip:boolean = false;
  @Input() backHistory:boolean = false

  constructor(private location: Location,
    private route: Router, 
    private activatedRoute: ActivatedRoute) { }


  goBack():void{
    if(this.backHistory){
      this.location.back()
    }
    else{
      this.route.navigate([this.back], {relativeTo: this.activatedRoute});
    }
    
  }
}
