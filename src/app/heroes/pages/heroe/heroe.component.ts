import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { HeroesService } from '../../services/heroes.service';
import { Heroe } from '../../interfaces/heroes.interfaces';

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
})
export class HeroeComponent implements OnInit {

  heroe!: Heroe;

  constructor(
    private activatedRoute: ActivatedRoute,
    private heroesService: HeroesService,
    private router: Router ) { }

  ngOnInit(): void {
    //emite los parametros del link clickado.
    this.activatedRoute.params
    .pipe(
      //switchmap recibe lo que el observable pipe esta emitiendo.
      switchMap( ({ id }) => this.heroesService.getHeroePorId( id ) )
        )
        .subscribe( heroe => this.heroe = heroe );
  }
  //navega hasta la ruta especificada, navigate es un metodo del servicio Router
  regresar() {
    this.router.navigate(['/heroes/listado']);
  }
}
