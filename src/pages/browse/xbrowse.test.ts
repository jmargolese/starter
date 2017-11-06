import { BrowsePage } from './browse';
import { TestBed, ComponentFixture, async } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { Share } from '../../app/app.component';
import { OrganizationProvider } from './../../share-common/providers/organization/organization';

 
let comp: BrowsePage;
let fixture: ComponentFixture<BrowsePage>;
let de: DebugElement;
let el: HTMLElement;
 
describe('Page: Browse', () => {
 
    beforeEach(async(() => {
 
        TestBed.configureTestingModule({
 
            declarations: [Share, BrowsePage],
 
            providers: [
 
            ],
 
            imports: [
                IonicModule.forRoot(Share)
            ]
 
        }).compileComponents();
 
    }));
 
    beforeEach(() => {
 
        fixture = TestBed.createComponent(BrowsePage);
        comp    = fixture.componentInstance;
 
    });
 
    afterEach(() => {
        fixture.destroy();
        comp = null;
        de = null;
        el = null;
    });
 
    it('is created', () => {
 
        expect(fixture).toBeTruthy();
        expect(comp).toBeTruthy();
 
    });
 
    it('initialises with a title of Browse', () => {
        expect(comp['title']).toEqual('Browse');
    });
 
    it('can set the title to a supplied value', () => {
 
        de = fixture.debugElement.query(By.css('ion-title'));
        el = de.nativeElement; 
 
        comp.setTitle('Your Page');
        fixture.detectChanges();
        expect(comp['title']).toEqual('Your Page');
        expect(el.textContent).toContain('Your Page');
 
    });
 
});