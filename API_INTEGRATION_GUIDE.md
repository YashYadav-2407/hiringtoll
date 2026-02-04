/**
 * EXAMPLE: How to integrate real APIs with the LearnService
 * 
 * This file demonstrates how to connect the LearnService to external
 * coding-related APIs for real data.
 */

// ============================================
// EXAMPLE 1: CodeWars API Integration
// ============================================

/**
 * To fetch real challenges from CodeWars API:
 * 
 * getChallenges(): Observable<Challenge[]> {
 *   return this.http.get<any[]>('https://www.codewars.com/api/v1/code-challenges/trending')
 *     .pipe(
 *       map(response => response.map(item => ({
 *         id: item.id,
 *         title: item.name,
 *         description: item.description,
 *         difficulty: item.rank?.name || 'medium',
 *         category: item.tags?.[0] || 'General',
 *         acceptance_rate: item.approved_by?.length || 0
 *       }))),
 *       catchError(error => {
 *         console.error('Error fetching CodeWars challenges:', error);
 *         return of([]);
 *       })
 *     );
 * }
 */

// ============================================
// EXAMPLE 2: RapidAPI - LeetCode/AlgoExpert
// ============================================

/**
 * To fetch challenges from LeetCode via RapidAPI:
 * 
 * getChallenges(): Observable<Challenge[]> {
 *   const options = {
 *     method: 'GET',
 *     url: 'https://leetcode-graphql.p.rapidapi.com/graphql',
 *     headers: {
 *       'x-rapidapi-key': 'YOUR_API_KEY',
 *       'x-rapidapi-host': 'leetcode-graphql.p.rapidapi.com'
 *     }
 *   };
 * 
 *   return this.http.get<any>(options.url, { headers: options.headers })
 *     .pipe(
 *       map(data => data.data.allProblems.edges.map(edge => ({
 *         id: edge.node.questionId,
 *         title: edge.node.title,
 *         description: edge.node.content,
 *         difficulty: edge.node.difficulty,
 *         category: edge.node.topicTags?.[0]?.name || 'General',
 *         acceptance_rate: edge.node.acceptanceRate
 *       }))),
 *       catchError(error => {
 *         console.error('Error fetching LeetCode data:', error);
 *         return of([]);
 *       })
 *     );
 * }
 */

// ============================================
// EXAMPLE 3: Programming API (API-Ninjas)
// ============================================

/**
 * To fetch tutorials from API-Ninjas:
 * 
 * getTutorials(): Observable<Tutorial[]> {
 *   const apiKey = 'YOUR_API_KEY';
 *   const headers = new HttpHeaders({
 *     'X-Api-Key': apiKey
 *   });
 * 
 *   return this.http.get<any>('https://api.api-ninjas.com/v1/docs', 
 *     { headers }
 *   ).pipe(
 *     map(response => response.map(item => ({
 *       id: item.id,
 *       title: item.title,
 *       description: item.description,
 *       language: item.language,
 *       difficulty: item.difficulty || 'beginner',
 *       duration: item.estimated_duration || 'Unknown',
 *       url: item.documentation_url
 *     }))),
 *     catchError(error => {
 *       console.error('Error fetching tutorials:', error);
 *       return of([]);
 *     })
 *   );
 * }
 */

// ============================================
// EXAMPLE 4: Custom Backend API
// ============================================

/**
 * If you have your own backend API:
 * 
 * getTutorials(): Observable<Tutorial[]> {
 *   return this.http.get<Tutorial[]>('/api/tutorials')
 *     .pipe(
 *       catchError(error => {
 *         console.error('Error fetching tutorials:', error);
 *         return of([]);
 *       })
 *     );
 * }
 * 
 * getChallenges(): Observable<Challenge[]> {
 *   return this.http.get<Challenge[]>('/api/challenges')
 *     .pipe(
 *       catchError(error => {
 *         console.error('Error fetching challenges:', error);
 *         return of([]);
 *       })
 *     );
 * }
 * 
 * getDocumentation(): Observable<Documentation[]> {
 *   return this.http.get<Documentation[]>('/api/documentation')
 *     .pipe(
 *       catchError(error => {
 *         console.error('Error fetching documentation:', error);
 *         return of([]);
 *       })
 *     );
 * }
 */

// ============================================
// RECOMMENDED FREE APIs FOR CODING CONTENT
// ============================================

/**
 * 1. CodeWars API
 *    - URL: https://www.codewars.com/api/v1
 *    - Docs: https://docs.codewars.com/
 *    - Rate Limit: 2000 requests/day
 *    - No auth required for public data
 * 
 * 2. Exercism API
 *    - URL: https://api.exercism.org
 *    - Docs: https://github.com/exercism/api
 *    - Free tier available
 * 
 * 3. HackerRank API
 *    - URL: https://www.hackerrank.com/api
 *    - Requires API key
 *    - Premium service
 * 
 * 4. DevDocs API
 *    - URL: https://devdocs.io/
 *    - Open source documentation
 *    - No API but provides HTML/JSON
 * 
 * 5. Open Trivia Database
 *    - URL: https://opentdb.com/api.php
 *    - Free to use, no key needed
 */

// ============================================
// SETUP INSTRUCTIONS
// ============================================

/**
 * Step 1: Create environment files
 * 
 * src/environments/environment.ts:
 * export const environment = {
 *   production: false,
 *   apis: {
 *     codeWars: 'https://www.codewars.com/api/v1',
 *     rapidApi: 'https://api.api-ninjas.com/v1',
 *     exercism: 'https://api.exercism.org',
 *     rapidApiKey: 'YOUR_KEY_HERE'
 *   }
 * };
 * 
 * Step 2: Update LearnService to use environment
 * 
 * import { environment } from '../../../environments/environment';
 * 
 * constructor(private http: HttpClient) {
 *   this.apiBaseUrls = environment.apis;
 * }
 * 
 * Step 3: Replace mock data with HTTP calls
 * 
 * Step 4: Add error handling and loading states
 * 
 * Step 5: Test with real data
 */
