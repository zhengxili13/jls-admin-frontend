import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShipmentInfoDialogComponent } from './shipment-info-dialog.component';

describe('ShipmentInfoDialogComponent', () => {
  let component: ShipmentInfoDialogComponent;
  let fixture: ComponentFixture<ShipmentInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShipmentInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShipmentInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
