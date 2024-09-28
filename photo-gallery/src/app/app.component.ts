import { Component } from '@angular/core';
import { SupabaseService } from './services/supabase.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private supabase: SupabaseService
  ) {
    this.supabase.authChanges()
  }
}
