import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { FotosPage } from './fotos.page';

describe('FotosPage', () => {
  let component: FotosPage;
  let fixture: ComponentFixture<FotosPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FotosPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule]
    }).compileComponents();

    fixture = TestBed.createComponent(FotosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
