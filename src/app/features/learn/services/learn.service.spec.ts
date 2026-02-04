import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LearnService } from './learn.service';

describe('LearnService', () => {
  let service: LearnService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LearnService]
    });

    service = TestBed.inject(LearnService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tutorials', (done: any) => {
    service.getTutorials().subscribe((tutorials) => {
      expect(tutorials.length).toBeGreaterThan(0);
      expect(tutorials[0]).toHaveProperty('title');
      expect(tutorials[0]).toHaveProperty('difficulty');
      done();
    });
  });

  it('should fetch challenges', (done: any) => {
    service.getChallenges().subscribe((challenges) => {
      expect(challenges.length).toBeGreaterThan(0);
      expect(challenges[0]).toHaveProperty('title');
      expect(challenges[0]).toHaveProperty('difficulty');
      done();
    });
  });

  it('should fetch documentation', (done: any) => {
    service.getDocumentation().subscribe((docs) => {
      expect(docs.length).toBeGreaterThan(0);
      expect(docs[0]).toHaveProperty('title');
      expect(docs[0]).toHaveProperty('language');
      done();
    });
  });

  it('should return all learning content', () => {
    const allContent = service.getAllLearningContent();
    expect(allContent).toHaveProperty('tutorials$');
    expect(allContent).toHaveProperty('challenges$');
    expect(allContent).toHaveProperty('documentation$');
  });
});
