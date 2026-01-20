import { Component } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [MatDividerModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class FooterComponent {

}
