import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthService } from '../../services/auth.service';
import { CardsService } from '../../services/cards.service';
import { DashboardComponent } from './dashboard.component';
import { of } from 'rxjs';

const mockAuthService = {
  logout: jasmine.createSpy('logout'),
};

const mockCardsService = {
  getCards: jasmine.createSpy('getCards').and.returnValue(of({ passes: [] })),
  searchByField: jasmine
    .createSpy('searchByField')
    .and.returnValue(of({ passes: [] })),
  sendPush: jasmine.createSpy('sendPush').and.returnValue(of({})),
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: CardsService, useValue: mockCardsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.cards()).toEqual([]);
    expect(component.loading()).toBeFalse();
  });
});
