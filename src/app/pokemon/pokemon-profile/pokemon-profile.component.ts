import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PokemonService } from '../../pokemon.service';
import { DatePipe, CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-pokemon-profile',
      imports: [DatePipe, RouterLink, CommonModule],
      templateUrl: './pokemon-profile.component.html',
      styles: ``
})
export class PokemonProfileComponent {
  private readonly route = inject(ActivatedRoute);
  readonly router = inject(Router);
  private readonly pokemonService = inject(PokemonService);

  private readonly pokemonId = signal(Number(this.route.snapshot.paramMap.get('id')));
  readonly pokemonResource = this.pokemonService.getPokemonById(this.pokemonId);

  deletePokemon(pokemonId: number) {
    this.pokemonService.deletePokemon(pokemonId).subscribe(() => {
      this.router.navigate(['/pokemons']);
    });
  }

  onImageError(event: Event) {
    console.error('Image failed to load:', event);
    const img = event.target as HTMLImageElement;
    img.src = 'https://via.placeholder.com/150x150?text=No+Image';
  }
}
