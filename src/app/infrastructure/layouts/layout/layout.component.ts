import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { Router, ActivatedRoute } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { LocalStorageUsuarioService } from '../../services/local/local-storage-usuario.service';

import { Store  } from '@ngrx/store';
import { AppCpState } from '../../global-store/cp.reducers';

import {  Subscription } from 'rxjs';
import { MenuOpcionesSistema, Opciones, OpcionSistema } from '../../../domain/dto/OpcionesResponse.dto';

import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { MenuComponent } from '../../shared/components/menu/menu.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';

import {SidebarModule} from 'primeng/sidebar';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    FormsModule, 
    ReactiveFormsModule, 
    SidebarModule,
    NavbarComponent,
    MenuComponent,
    FooterComponent,
    PageHeaderComponent],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {
  sidebarShow:boolean=false;
  display:boolean = false;

  listaOpciones: OpcionSistema[]=[];
  /*
    {title:"test 1", description: "text 1", select:false, icon: "pi pi-book", url:"mantenimientos/vistmas"},
    {title:"test 2", description: "text 2", select:false, icon: "pi pi-book", url:"mantenimientos/vistmas"},
    {title:"test 3", description: "text 3", select:false, icon: "pi pi-book", url:"mantenimientos/vistmas"},
    {title:"test 4", description: "text 4", select:false, icon: "pi pi-book", url:"mantenimientos/vistmas"},
  ];*/
  //perfil:string ='1';
  dataOpciones:MenuOpcionesSistema;
  seleccionarOpcion: Subscription = new Subscription();
  constructor(private route: Router, 
    private activatedRoute: ActivatedRoute,
    private localStorageUsuarioService: LocalStorageUsuarioService,
    private store: Store<AppCpState>) { 
      this.dataOpciones = this.localStorageUsuarioService.getOpciones();
      //console.log("data opciones",this.dataOpciones);
      if(this.dataOpciones){
        this.listaOpciones = this.dataOpciones.opciones;
      }
  }

  ngOnInit(): void {
    this.seleccionarOpcion = this.store.select('seleccionarOpcioMenu').subscribe(( {url} ) => {
      if(url!=""){
        //console.log("seleccionar opcion",url);
        this.cleanSelected(this.listaOpciones);
        this.selectedRouteUrl(this.listaOpciones ,url);
      }
    });

    /*
    if(this.dataOpciones){
      console.log("generando.....");
      //this.generateOpcionesSistema(this.dataOpciones.opciones,'');
      this.listaOpciones = this.dataOpciones.opciones;

    }*/

  }
  sidebarOnChange(event:any):void{
    /* console.log("event layout",event); */
    this.sidebarShow = event;
  }
  drawableOnChange(event:any):void{
    this.display = event;
  }

  cleanSelected(listaOps:OpcionSistema[]):void{
    /*
    this.listaOpciones.forEach(function(element, index, array){
      element.select = false;
    });
    */
   for(let i =0;i<listaOps.length;i++){
    if(listaOps[i].hijos.length>0){
      this.cleanSelected(listaOps[i].hijos);
    }
    listaOps[i].select = false;
   }

  }

  goRoute(indice:number):void{
    if(indice>=0){
      this.cleanSelected(this.listaOpciones);
      // activar
      this.goOpcion(this.listaOpciones,indice);
      //this.listaOpciones[indice].select=true;
      //this.route.navigate([''+this.listaOpciones[indice].uri], {relativeTo: this.activatedRoute});
    }
  }


  goOpcion(listaOps:OpcionSistema[], id:number):void{
    //console.log("opcion seleccinado", id);
    for(let i =0;i<listaOps.length;i++){
      if(listaOps[i].hijos.length>0){
        this.goOpcion(listaOps[i].hijos, id);
      }
      else{
        if(listaOps[i].id === id){
          listaOps[i].select=true;
          this.route.navigate([listaOps[i].url], {relativeTo: this.activatedRoute});
          break;
        }
      }
    }
  }

  onActivateEvent(id:number){
    //console.log("activar opcion ",id);
    this.activateOpcion(this.listaOpciones, id);
    //console.log("opciones actualizadas", this.listaOpciones);
  }

  activateOpcion(listaOps:OpcionSistema[], id:number):void{
    //console.log("activando.....", id);
    for(let i =0;i<listaOps.length;i++){
      //console.log("opcion verificado",listaOps[i]);
      if(listaOps[i].id == id){
        listaOps[i].activate = !listaOps[i].activate;
        break;
      }
      else{
        if(listaOps[i].hijos.length>0){
          this.activateOpcion(listaOps[i].hijos, id);

        }
      }
      
    }
  }

  selectedRouteUrl(listaOps:OpcionSistema[], uri:string):boolean{
    let seleccionado:boolean = false;
    /*
    for(let i:number=0;i<this.listaOpciones.length;i++){
      if(this.listaOpciones[i].uri === uri){
        this.listaOpciones[i].select=true;
        break;
      }
    }*/
    for(let i =0;i<listaOps.length;i++){
      //console.log(listaOps[i].url);
      if(listaOps[i].hijos.length>0){
        let seleccion:boolean =this.selectedRouteUrl(listaOps[i].hijos, uri);
        if(seleccion){
          listaOps[i].activate = true;
          listaOps[i]={...listaOps[i]};
          seleccionado = true;
          break;
        }
      }
      else{
        if(listaOps[i].url == uri){
          listaOps[i].select=true;
          listaOps[i]={...listaOps[i]};
          //this.route.navigate([uri+listaOps[i].url], {relativeTo: this.activatedRoute});
          return true;
          //break;
        }
      }
    }
    return seleccionado;
  }
  generateOpcionesSistema(listaOps:OpcionSistema[], urlIni:String):void{
    for(let i =0;i<listaOps.length;i++){
      if(listaOps[i].hijos.length>0){
        this.generateOpcionesSistema(listaOps[i].hijos, urlIni+listaOps[i].url );
      }
      else{
        listaOps[i].url = urlIni+listaOps[i].url;
      }
    }
  }

  ngOnDestroy(): void {
    this.seleccionarOpcion.unsubscribe();
  }
}
