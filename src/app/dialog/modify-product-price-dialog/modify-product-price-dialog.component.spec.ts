import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyProductPriceDialogComponent } from './modify-product-price-dialog.component';

describe('ModifyProductPriceDialogComponent', () => {
  let component: ModifyProductPriceDialogComponent;
  let fixture: ComponentFixture<ModifyProductPriceDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModifyProductPriceDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifyProductPriceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
