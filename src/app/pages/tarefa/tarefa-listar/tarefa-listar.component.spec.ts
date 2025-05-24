import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarefaListarComponent } from './tarefa-listar.component';

describe('TarefaListarComponent', () => {
  let component: TarefaListarComponent;
  let fixture: ComponentFixture<TarefaListarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarefaListarComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarefaListarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
