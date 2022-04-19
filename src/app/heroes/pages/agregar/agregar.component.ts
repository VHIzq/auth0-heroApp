// propios de ng
import { Component, OnInit } from '@angular/core';
import { switchMap } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

//de terceros
import { MatCardLgImage } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

//personalizados
import { Heroe, Publisher } from '../../interfaces/heroes.interfaces';
import { HeroesService } from '../../services/heroes.service';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
    `
    width: 100%;
    border-radius: 5px;
    `
  ]
})
export class AgregarComponent implements OnInit {

  publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics'
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics'
    }
  ];

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.DCComics,
    alt_img: '',
  }

  constructor(
    private heroesService: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    ) { }

  ngOnInit(): void {

    if ( !this.router.url.includes('editar') ) {
      return;
    }
    this.activatedRoute.params
      .pipe(
        switchMap( ({id} ) => this.heroesService.getHeroePorId( id ))
      )
      .subscribe( heroe => this.heroe = heroe );
  }

  guardar() {
    if( this.heroe.superhero.trim().length === 0){
      return;
    }

    if( this.heroe.id ) {
      //update hero regisrter
      this.heroesService.updateHeroe( this.heroe )
        .subscribe( heroe => this.mostrarSnackBar('Registro Actualizado') );
    } else {
      //create hero register
      this.heroesService.addHeroe( this.heroe )
        .subscribe( heroe => {
          this.router.navigate(['/heroes/editar', heroe.id]);
          this.mostrarSnackBar('Héroe creado exitosamente')
        })
    }
  };

  borrarHeroe() {
    const dialog =  this.dialog.open( ConfirmarComponent, {
      width: '320px',
      data: { ...this.heroe }
    });

    dialog.afterClosed().subscribe(
      ( result ) => {
        if( result ) {
          this.heroesService.deleteHeroe( this.heroe.id! )
            .subscribe( resp => {
              this.router.navigate(['/heroes']);
            })
        }
      }
    )

  }

  mostrarSnackBar( mensaje: string ){
    this.snackBar.open( mensaje, 'Ok!', {
      duration: 2500
    });
  }
}
