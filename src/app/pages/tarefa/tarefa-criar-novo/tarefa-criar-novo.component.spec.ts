import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaCriarNovoComponent } from './tarefa-criar-novo.component';

describe('TarefaCriarNovoComponent', () => {
  let component: TarefaCriarNovoComponent;
  let fixture: ComponentFixture<TarefaCriarNovoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarefaCriarNovoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarefaCriarNovoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
