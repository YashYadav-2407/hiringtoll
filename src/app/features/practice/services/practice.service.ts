import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface AlgorithmChallenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  timeLimit: number; // in minutes
  acceptance_rate?: number;
  leetcodeUrl?: string;
}

export interface BeginnerExercise {
  id: string;
  title: string;
  description: string;
  topic: string;
  difficulty: 'beginner' | 'intermediate';
  duration: string;
  language: string;
  hints?: number;
}

export interface SpeedCoding {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeLimit: number; // in seconds
  category: string;
  reward: number; // points
}

export interface SkillAssessment {
  id: string;
  title: string;
  description: string;
  topic: string;
  questions: number;
  duration: number; // in minutes
  level: 'beginner' | 'intermediate' | 'advanced';
  passingScore: number; // percentage
}

export interface MCQOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface MCQQuestion {
  id: string;
  topic: string;
  question: string;
  options: MCQOption[];
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface TestResult {
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  passed: boolean;
  answers: { questionId: string; selectedOptionId: string }[];
}

@Injectable({
  providedIn: 'root'
})
export class PracticeService {
  constructor(private http: HttpClient) {}

  /**
   * Get Algorithm Challenges (50 problems)
   */
  getAlgorithmChallenges(): Observable<AlgorithmChallenge[]> {
    const challenges: AlgorithmChallenge[] = [
      { id: '1', title: 'Two Sum', description: 'Find two numbers that sum to target', difficulty: 'easy', category: 'Arrays', timeLimit: 15, acceptance_rate: 48, leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
      { id: '2', title: 'Reverse Array', description: 'Reverse array elements in-place', difficulty: 'easy', category: 'Arrays', timeLimit: 10, acceptance_rate: 85, leetcodeUrl: 'https://leetcode.com/problems/reverse-array/' },
      { id: '3', title: 'Remove Duplicates', description: 'Remove duplicate elements from array', difficulty: 'easy', category: 'Arrays', timeLimit: 12, acceptance_rate: 64, leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates/' },
      { id: '4', title: 'Merge Sorted Arrays', description: 'Merge two sorted arrays', difficulty: 'easy', category: 'Arrays', timeLimit: 15, acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/merge-sorted-array/' },
      { id: '5', title: 'Find Max Min', description: 'Find max and min in single pass', difficulty: 'easy', category: 'Arrays', timeLimit: 10, acceptance_rate: 92, leetcodeUrl: 'https://leetcode.com/problems/find-maxmin/' },
      { id: '6', title: 'Rotate Array', description: 'Rotate array by k positions', difficulty: 'medium', category: 'Arrays', timeLimit: 20, acceptance_rate: 42, leetcodeUrl: 'https://leetcode.com/problems/rotate-array/' },
      { id: '7', title: 'Product Array', description: 'Product of array except self', difficulty: 'medium', category: 'Arrays', timeLimit: 25, acceptance_rate: 67, leetcodeUrl: 'https://leetcode.com/problems/product-of-array-except-self/' },
      { id: '8', title: 'Container Water', description: 'Container with most water', difficulty: 'medium', category: 'Arrays', timeLimit: 20, acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: '9', title: '3Sum Problem', description: 'Find all unique triplets', difficulty: 'medium', category: 'Arrays', timeLimit: 30, acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
      { id: '10', title: 'Longest Substring', description: 'Longest substring without repeating', difficulty: 'medium', category: 'Strings', timeLimit: 25, acceptance_rate: 35, leetcodeUrl: 'https://leetcode.com/problems/longest-substring/' },
      { id: '11', title: 'Palindrome Substring', description: 'Longest palindromic substring', difficulty: 'hard', category: 'Strings', timeLimit: 35, acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/palindrome-substring/' },
      { id: '12', title: 'Regular Expression', description: 'Regex pattern matching', difficulty: 'hard', category: 'Strings', timeLimit: 40, acceptance_rate: 28, leetcodeUrl: 'https://leetcode.com/problems/regex-matching/' },
      { id: '13', title: 'Validate Parentheses', description: 'Check if parentheses valid', difficulty: 'easy', category: 'Stack', timeLimit: 12, acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: '14', title: 'Min Stack', description: 'Stack with min operation', difficulty: 'medium', category: 'Stack', timeLimit: 20, acceptance_rate: 45, leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
      { id: '15', title: 'Evaluate Postfix', description: 'Evaluate postfix expression', difficulty: 'medium', category: 'Stack', timeLimit: 22, acceptance_rate: 56, leetcodeUrl: 'https://leetcode.com/problems/evaluate-postfix/' },
      { id: '16', title: 'Binary Search', description: 'Classic binary search', difficulty: 'easy', category: 'Search', timeLimit: 15, acceptance_rate: 46, leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
      { id: '17', title: 'Search Rotated', description: 'Search in rotated array', difficulty: 'medium', category: 'Search', timeLimit: 25, acceptance_rate: 33, leetcodeUrl: 'https://leetcode.com/problems/search-rotated/' },
      { id: '18', title: 'First Last Position', description: 'Find first and last position', difficulty: 'medium', category: 'Search', timeLimit: 20, acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/first-last-position/' },
      { id: '19', title: 'N-Queens', description: 'Solve N-Queens problem', difficulty: 'hard', category: 'Backtracking', timeLimit: 40, acceptance_rate: 64, leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },
      { id: '20', title: 'Word Search', description: 'Word search in grid', difficulty: 'hard', category: 'Backtracking', timeLimit: 35, acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/word-search/' },
      { id: '21', title: 'Climbing Stairs', description: 'Dynamic programming stairs', difficulty: 'easy', category: 'DP', timeLimit: 15, acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: '22', title: 'Coin Change', description: 'Minimum coins needed', difficulty: 'medium', category: 'DP', timeLimit: 25, acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/coin-change/' },
      { id: '23', title: 'Edit Distance', description: 'Calculate edit distance', difficulty: 'hard', category: 'DP', timeLimit: 35, acceptance_rate: 49, leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
      { id: '24', title: 'Validate BST', description: 'Validate binary search tree', difficulty: 'medium', category: 'Trees', timeLimit: 20, acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/validate-bst/' },
      { id: '25', title: 'Tree Inorder', description: 'Inorder traversal of tree', difficulty: 'easy', category: 'Trees', timeLimit: 15, acceptance_rate: 68, leetcodeUrl: 'https://leetcode.com/problems/tree-inorder/' },
      { id: '26', title: 'LCA Binary Tree', description: 'Lowest common ancestor', difficulty: 'medium', category: 'Trees', timeLimit: 22, acceptance_rate: 53, leetcodeUrl: 'https://leetcode.com/problems/lca-binary-tree/' },
      { id: '27', title: 'Level Order Traversal', description: 'Level order tree traversal', difficulty: 'medium', category: 'Trees', timeLimit: 20, acceptance_rate: 65, leetcodeUrl: 'https://leetcode.com/problems/level-order/' },
      { id: '28', title: 'Serialize Deserialize', description: 'Serialize binary tree', difficulty: 'hard', category: 'Trees', timeLimit: 40, acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/serialize-tree/' },
      { id: '29', title: 'Graph Traversal', description: 'BFS and DFS on graphs', difficulty: 'medium', category: 'Graphs', timeLimit: 25, acceptance_rate: 58, leetcodeUrl: 'https://leetcode.com/problems/graph-traversal/' },
      { id: '30', title: 'Shortest Path', description: 'Find shortest path in graph', difficulty: 'medium', category: 'Graphs', timeLimit: 28, acceptance_rate: 45, leetcodeUrl: 'https://leetcode.com/problems/shortest-path/' },
      { id: '31', title: 'Topological Sort', description: 'Topological sorting', difficulty: 'medium', category: 'Graphs', timeLimit: 25, acceptance_rate: 51, leetcodeUrl: 'https://leetcode.com/problems/topological-sort/' },
      { id: '32', title: 'Connected Components', description: 'Find connected components', difficulty: 'hard', category: 'Graphs', timeLimit: 30, acceptance_rate: 55, leetcodeUrl: 'https://leetcode.com/problems/connected-components/' },
      { id: '33', title: 'Median of Arrays', description: 'Find median of two arrays', difficulty: 'hard', category: 'Arrays', timeLimit: 35, acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/median-arrays/' },
      { id: '34', title: 'Skyline Problem', description: 'Building skyline problem', difficulty: 'hard', category: 'Arrays', timeLimit: 40, acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/skyline/' },
      { id: '35', title: 'Jump Game', description: 'Can you reach last index', difficulty: 'medium', category: 'Greedy', timeLimit: 20, acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/jump-game/' },
      { id: '36', title: 'Jump Game II', description: 'Minimum jumps to reach end', difficulty: 'hard', category: 'Greedy', timeLimit: 28, acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/' },
      { id: '37', title: 'Gas Station', description: 'Gas station problem', difficulty: 'medium', category: 'Greedy', timeLimit: 22, acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/gas-station/' },
      { id: '38', title: 'Interval Scheduling', description: 'Schedule intervals problem', difficulty: 'medium', category: 'Greedy', timeLimit: 25, acceptance_rate: 48, leetcodeUrl: 'https://leetcode.com/problems/interval-scheduling/' },
      { id: '39', title: 'LRU Cache', description: 'Design LRU cache', difficulty: 'hard', category: 'Design', timeLimit: 35, acceptance_rate: 35, leetcodeUrl: 'https://leetcode.com/problems/lru-cache/' },
      { id: '40', title: 'Word Ladder', description: 'Word ladder problem', difficulty: 'hard', category: 'BFS', timeLimit: 35, acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },
      { id: '41', title: 'Combination Sum', description: 'Find all combinations', difficulty: 'medium', category: 'Backtracking', timeLimit: 25, acceptance_rate: 68, leetcodeUrl: 'https://leetcode.com/problems/combination-sum/' },
      { id: '42', title: 'Permutations', description: 'Generate permutations', difficulty: 'medium', category: 'Backtracking', timeLimit: 22, acceptance_rate: 78, leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
      { id: '43', title: 'Subsets', description: 'Generate all subsets', difficulty: 'medium', category: 'Backtracking', timeLimit: 20, acceptance_rate: 75, leetcodeUrl: 'https://leetcode.com/problems/subsets/' },
      { id: '44', title: 'Sudoku Solver', description: 'Solve sudoku puzzle', difficulty: 'hard', category: 'Backtracking', timeLimit: 40, acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/sudoku-solver/' },
      { id: '45', title: 'Majority Element', description: 'Find majority element', difficulty: 'easy', category: 'Arrays', timeLimit: 15, acceptance_rate: 64, leetcodeUrl: 'https://leetcode.com/problems/majority-element/' },
      { id: '46', title: 'Missing Number', description: 'Find missing number', difficulty: 'easy', category: 'Arrays', timeLimit: 12, acceptance_rate: 60, leetcodeUrl: 'https://leetcode.com/problems/missing-number/' },
      { id: '47', title: 'Single Number', description: 'Find single appearing number', difficulty: 'easy', category: 'Bit Manipulation', timeLimit: 13, acceptance_rate: 68, leetcodeUrl: 'https://leetcode.com/problems/single-number/' },
      { id: '48', title: 'Hamming Distance', description: 'Hamming distance between numbers', difficulty: 'easy', category: 'Bit Manipulation', timeLimit: 10, acceptance_rate: 85, leetcodeUrl: 'https://leetcode.com/problems/hamming-distance/' },
      { id: '49', title: 'Power of Two', description: 'Check if power of 2', difficulty: 'easy', category: 'Bit Manipulation', timeLimit: 12, acceptance_rate: 47, leetcodeUrl: 'https://leetcode.com/problems/power-of-two/' },
      { id: '50', title: 'Integer Break', description: 'Break integer to maximize product', difficulty: 'medium', category: 'Math', timeLimit: 20, acceptance_rate: 48, leetcodeUrl: 'https://leetcode.com/problems/integer-break/' }
    ];
    return of(challenges).pipe(
      catchError(error => {
        console.error('Error fetching algorithm challenges:', error);
        return of([]);
      })
    );
  }

  /**
   * Get Beginner Exercises (40 exercises)
   */
  getBeginnerExercises(): Observable<BeginnerExercise[]> {
    const exercises: BeginnerExercise[] = [
      { id: '1', title: 'Hello World', description: 'Print Hello World', topic: 'Basics', difficulty: 'beginner', duration: '5 min', language: 'Python', hints: 1 },
      { id: '2', title: 'Simple Math', description: 'Basic arithmetic operations', topic: 'Operators', difficulty: 'beginner', duration: '8 min', language: 'Python', hints: 2 },
      { id: '3', title: 'Variables', description: 'Declare and use variables', topic: 'Variables', difficulty: 'beginner', duration: '10 min', language: 'Python', hints: 1 },
      { id: '4', title: 'String Basics', description: 'Work with strings', topic: 'Strings', difficulty: 'beginner', duration: '12 min', language: 'Python', hints: 2 },
      { id: '5', title: 'If Else', description: 'Conditional statements', topic: 'Control Flow', difficulty: 'beginner', duration: '15 min', language: 'Python', hints: 2 },
      { id: '6', title: 'Loops For', description: 'For loop basics', topic: 'Loops', difficulty: 'beginner', duration: '15 min', language: 'Python', hints: 2 },
      { id: '7', title: 'Loops While', description: 'While loop basics', topic: 'Loops', difficulty: 'beginner', duration: '12 min', language: 'Python', hints: 1 },
      { id: '8', title: 'Lists', description: 'Create and manipulate lists', topic: 'Data Structures', difficulty: 'beginner', duration: '18 min', language: 'Python', hints: 2 },
      { id: '9', title: 'Dictionaries', description: 'Key-value pairs', topic: 'Data Structures', difficulty: 'beginner', duration: '20 min', language: 'Python', hints: 2 },
      { id: '10', title: 'Functions Intro', description: 'Define simple functions', topic: 'Functions', difficulty: 'beginner', duration: '15 min', language: 'Python', hints: 1 },
      { id: '11', title: 'Function Parameters', description: 'Parameters and return values', topic: 'Functions', difficulty: 'beginner', duration: '18 min', language: 'Python', hints: 2 },
      { id: '12', title: 'Recursion Basics', description: 'Simple recursion', topic: 'Recursion', difficulty: 'intermediate', duration: '22 min', language: 'Python', hints: 3 },
      { id: '13', title: 'Array Iteration', description: 'Loop through arrays', topic: 'Arrays', difficulty: 'beginner', duration: '12 min', language: 'JavaScript', hints: 1 },
      { id: '14', title: 'String Methods', description: 'Common string methods', topic: 'Strings', difficulty: 'beginner', duration: '15 min', language: 'JavaScript', hints: 2 },
      { id: '15', title: 'Object Basics', description: 'Create objects', topic: 'Objects', difficulty: 'beginner', duration: '18 min', language: 'JavaScript', hints: 2 },
      { id: '16', title: 'ES6 Arrow Functions', description: 'Arrow function syntax', topic: 'Functions', difficulty: 'intermediate', duration: '15 min', language: 'JavaScript', hints: 2 },
      { id: '17', title: 'Template Literals', description: 'String interpolation', topic: 'Strings', difficulty: 'beginner', duration: '10 min', language: 'JavaScript', hints: 1 },
      { id: '18', title: 'Array Methods', description: 'Map, filter, reduce', topic: 'Arrays', difficulty: 'intermediate', duration: '22 min', language: 'JavaScript', hints: 3 },
      { id: '19', title: 'Promises Intro', description: 'Introduction to promises', topic: 'Async', difficulty: 'intermediate', duration: '25 min', language: 'JavaScript', hints: 3 },
      { id: '20', title: 'Async Await', description: 'Async and await keywords', topic: 'Async', difficulty: 'intermediate', duration: '20 min', language: 'JavaScript', hints: 2 },
      { id: '21', title: 'Java Variables', description: 'Variables in Java', topic: 'Basics', difficulty: 'beginner', duration: '15 min', language: 'Java', hints: 1 },
      { id: '22', title: 'Java Loops', description: 'For and while loops', topic: 'Control Flow', difficulty: 'beginner', duration: '18 min', language: 'Java', hints: 2 },
      { id: '23', title: 'Java Methods', description: 'Define methods in Java', topic: 'Functions', difficulty: 'beginner', duration: '18 min', language: 'Java', hints: 2 },
      { id: '24', title: 'Java Classes', description: 'Create classes and objects', topic: 'OOP', difficulty: 'intermediate', duration: '25 min', language: 'Java', hints: 3 },
      { id: '25', title: 'Inheritance', description: 'Class inheritance basics', topic: 'OOP', difficulty: 'intermediate', duration: '25 min', language: 'Java', hints: 2 },
      { id: '26', title: 'Interfaces', description: 'Working with interfaces', topic: 'OOP', difficulty: 'intermediate', duration: '22 min', language: 'Java', hints: 2 },
      { id: '27', title: 'HTML Structure', description: 'HTML basics', topic: 'Web', difficulty: 'beginner', duration: '15 min', language: 'HTML', hints: 1 },
      { id: '28', title: 'CSS Styling', description: 'Basic CSS styling', topic: 'Web', difficulty: 'beginner', duration: '18 min', language: 'CSS', hints: 2 },
      { id: '29', title: 'CSS Flexbox', description: 'Flexbox layout', topic: 'Web', difficulty: 'intermediate', duration: '20 min', language: 'CSS', hints: 2 },
      { id: '30', title: 'CSS Grid', description: 'Grid layout system', topic: 'Web', difficulty: 'intermediate', duration: '22 min', language: 'CSS', hints: 2 },
      { id: '31', title: 'Forms HTML', description: 'HTML form elements', topic: 'Web', difficulty: 'beginner', duration: '16 min', language: 'HTML', hints: 2 },
      { id: '32', title: 'Responsive Design', description: 'Mobile responsive layouts', topic: 'Web', difficulty: 'intermediate', duration: '25 min', language: 'CSS', hints: 3 },
      { id: '33', title: 'DOM Manipulation', description: 'Manipulate DOM with JS', topic: 'Web', difficulty: 'intermediate', duration: '20 min', language: 'JavaScript', hints: 2 },
      { id: '34', title: 'Event Handling', description: 'Handle user events', topic: 'Web', difficulty: 'intermediate', duration: '18 min', language: 'JavaScript', hints: 2 },
      { id: '35', title: 'Regular Expressions', description: 'Regex pattern matching', topic: 'Advanced', difficulty: 'intermediate', duration: '22 min', language: 'Python', hints: 3 },
      { id: '36', title: 'File I/O', description: 'Read and write files', topic: 'I/O', difficulty: 'intermediate', duration: '18 min', language: 'Python', hints: 2 },
      { id: '37', title: 'Error Handling', description: 'Try catch basics', topic: 'Error Handling', difficulty: 'intermediate', duration: '15 min', language: 'Python', hints: 2 },
      { id: '38', title: 'Modules Import', description: 'Import modules', topic: 'Modules', difficulty: 'intermediate', duration: '12 min', language: 'Python', hints: 1 },
      { id: '39', title: 'Unit Testing', description: 'Write unit tests', topic: 'Testing', difficulty: 'intermediate', duration: '25 min', language: 'Python', hints: 3 },
      { id: '40', title: 'Debugging', description: 'Debug code effectively', topic: 'Debugging', difficulty: 'intermediate', duration: '20 min', language: 'Python', hints: 2 }
    ];
    return of(exercises).pipe(
      catchError(error => {
        console.error('Error fetching beginner exercises:', error);
        return of([]);
      })
    );
  }

  /**
   * Get Speed Coding Challenges (30 challenges)
   */
  getSpeedCoding(): Observable<SpeedCoding[]> {
    const challenges: SpeedCoding[] = [
      { id: '1', title: 'Quick Add', description: 'Add two numbers', difficulty: 'easy', timeLimit: 30, category: 'Math', reward: 10 },
      { id: '2', title: 'String Reverse', description: 'Reverse string', difficulty: 'easy', timeLimit: 45, category: 'String', reward: 15 },
      { id: '3', title: 'Find Max', description: 'Find maximum in array', difficulty: 'easy', timeLimit: 30, category: 'Array', reward: 10 },
      { id: '4', title: 'Count Vowels', description: 'Count vowels in string', difficulty: 'easy', timeLimit: 45, category: 'String', reward: 15 },
      { id: '5', title: 'Check Prime', description: 'Check if number is prime', difficulty: 'easy', timeLimit: 60, category: 'Math', reward: 20 },
      { id: '6', title: 'Array Sum', description: 'Sum all array elements', difficulty: 'easy', timeLimit: 30, category: 'Array', reward: 10 },
      { id: '7', title: 'Duplicate Check', description: 'Check for duplicates', difficulty: 'easy', timeLimit: 45, category: 'Array', reward: 15 },
      { id: '8', title: 'Sort Array', description: 'Sort array quickly', difficulty: 'medium', timeLimit: 60, category: 'Array', reward: 25 },
      { id: '9', title: 'Merge Strings', description: 'Merge two strings', difficulty: 'easy', timeLimit: 30, category: 'String', reward: 10 },
      { id: '10', title: 'Remove Spaces', description: 'Remove spaces from string', difficulty: 'easy', timeLimit: 40, category: 'String', reward: 15 },
      { id: '11', title: 'Factorial', description: 'Calculate factorial', difficulty: 'easy', timeLimit: 45, category: 'Math', reward: 15 },
      { id: '12', title: 'Fibonacci', description: 'Generate fibonacci', difficulty: 'medium', timeLimit: 60, category: 'Math', reward: 25 },
      { id: '13', title: 'Palindrome Check', description: 'Check palindrome', difficulty: 'medium', timeLimit: 60, category: 'String', reward: 25 },
      { id: '14', title: 'Array Rotate', description: 'Rotate array', difficulty: 'medium', timeLimit: 75, category: 'Array', reward: 30 },
      { id: '15', title: 'Two Sum', description: 'Find two sum', difficulty: 'medium', timeLimit: 90, category: 'Array', reward: 35 },
      { id: '16', title: 'Binary Search', description: 'Binary search', difficulty: 'medium', timeLimit: 75, category: 'Search', reward: 30 },
      { id: '17', title: 'Valid Brackets', description: 'Check valid brackets', difficulty: 'medium', timeLimit: 60, category: 'Stack', reward: 25 },
      { id: '18', title: 'Anagram Check', description: 'Check if anagram', difficulty: 'medium', timeLimit: 75, category: 'String', reward: 30 },
      { id: '19', title: 'Matrix Sum', description: 'Sum 2D matrix', difficulty: 'easy', timeLimit: 45, category: 'Array', reward: 15 },
      { id: '20', title: 'String Contains', description: 'Check substring', difficulty: 'easy', timeLimit: 30, category: 'String', reward: 10 },
      { id: '21', title: 'Array Intersection', description: 'Find intersection', difficulty: 'medium', timeLimit: 75, category: 'Array', reward: 30 },
      { id: '22', title: 'String Replace', description: 'Replace characters', difficulty: 'easy', timeLimit: 40, category: 'String', reward: 15 },
      { id: '23', title: 'Linked List Sum', description: 'Sum linked list', difficulty: 'hard', timeLimit: 120, category: 'LinkedList', reward: 50 },
      { id: '24', title: '3Sum Problem', description: 'Find triplets', difficulty: 'hard', timeLimit: 120, category: 'Array', reward: 50 },
      { id: '25', title: 'LCS String', description: 'Longest common substring', difficulty: 'hard', timeLimit: 120, category: 'String', reward: 50 },
      { id: '26', title: 'Tree Traversal', description: 'Traverse tree', difficulty: 'hard', timeLimit: 120, category: 'Tree', reward: 50 },
      { id: '27', title: 'Graph Path', description: 'Find graph path', difficulty: 'hard', timeLimit: 120, category: 'Graph', reward: 50 },
      { id: '28', title: 'Min Coin', description: 'Min coins to reach', difficulty: 'hard', timeLimit: 120, category: 'DP', reward: 50 },
      { id: '29', title: 'Subset Sum', description: 'Subset sum problem', difficulty: 'hard', timeLimit: 120, category: 'DP', reward: 50 },
      { id: '30', title: 'Grid Paths', description: 'Unique grid paths', difficulty: 'hard', timeLimit: 120, category: 'DP', reward: 50 }
    ];
    return of(challenges).pipe(
      catchError(error => {
        console.error('Error fetching speed coding:', error);
        return of([]);
      })
    );
  }

  /**
   * Get Skill Assessments (15 comprehensive tests)
   */
  getSkillAssessments(): Observable<SkillAssessment[]> {
    const assessments: SkillAssessment[] = [
      { id: '1', title: 'Python Basics', description: 'Test your Python fundamentals', topic: 'Python', questions: 20, duration: 30, level: 'beginner', passingScore: 70 },
      { id: '2', title: 'JavaScript Essentials', description: 'JavaScript core concepts', topic: 'JavaScript', questions: 25, duration: 40, level: 'beginner', passingScore: 70 },
      { id: '3', title: 'Data Structures 101', description: 'Arrays, Lists, Maps, Sets', topic: 'Data Structures', questions: 25, duration: 45, level: 'beginner', passingScore: 70 },
      { id: '4', title: 'Algorithms Fundamentals', description: 'Basic algorithms and sorting', topic: 'Algorithms', questions: 25, duration: 50, level: 'intermediate', passingScore: 75 },
      { id: '5', title: 'String Manipulation', description: 'String problems and solutions', topic: 'Strings', questions: 20, duration: 35, level: 'intermediate', passingScore: 75 },
      { id: '6', title: 'Tree and Graph', description: 'Trees, BSTs, and graphs', topic: 'Trees/Graphs', questions: 30, duration: 60, level: 'intermediate', passingScore: 75 },
      { id: '7', title: 'Dynamic Programming', description: 'DP problems and concepts', topic: 'DP', questions: 25, duration: 55, level: 'intermediate', passingScore: 75 },
      { id: '8', title: 'Coding Interview Prep', description: 'LeetCode style problems', topic: 'Interview', questions: 35, duration: 90, level: 'advanced', passingScore: 80 },
      { id: '9', title: 'System Design', description: 'System design fundamentals', topic: 'System Design', questions: 20, duration: 60, level: 'advanced', passingScore: 80 },
      { id: '10', title: 'Web Development', description: 'HTML, CSS, JavaScript', topic: 'Web Dev', questions: 30, duration: 50, level: 'beginner', passingScore: 70 },
      { id: '11', title: 'Java Mastery', description: 'Complete Java assessment', topic: 'Java', questions: 30, duration: 60, level: 'intermediate', passingScore: 75 },
      { id: '12', title: 'Database SQL', description: 'SQL queries and database', topic: 'SQL', questions: 25, duration: 45, level: 'intermediate', passingScore: 75 },
      { id: '13', title: 'Git and Version Control', description: 'Git fundamentals', topic: 'Version Control', questions: 15, duration: 25, level: 'beginner', passingScore: 70 },
      { id: '14', title: 'Full Stack Developer', description: 'Complete full stack test', topic: 'Full Stack', questions: 40, duration: 90, level: 'advanced', passingScore: 80 },
      { id: '15', title: 'Problem Solving Pro', description: 'Advanced problem solving', topic: 'Problem Solving', questions: 30, duration: 75, level: 'advanced', passingScore: 80 }
    ];
    return of(assessments).pipe(
      catchError(error => {
        console.error('Error fetching skill assessments:', error);
        return of([]);
      })
    );
  }

  /**
   * Get MCQ Questions by topic
   */
  getSkillAssessmentQuestions(topic: string): Observable<MCQQuestion[]> {
    const questionsMap: { [key: string]: MCQQuestion[] } = {
      'Python': [
        { id: '1', topic: 'Python', question: 'What is the output of print(2 ** 3)?', options: [
          { id: 'a', text: '6', isCorrect: false },
          { id: 'b', text: '8', isCorrect: true },
          { id: 'c', text: '9', isCorrect: false },
          { id: 'd', text: '5', isCorrect: false }
        ], explanation: 'The ** operator is exponentiation. 2^3 = 8', difficulty: 'easy' },
        { id: '2', topic: 'Python', question: 'Which keyword is used to create a function in Python?', options: [
          { id: 'a', text: 'def', isCorrect: true },
          { id: 'b', text: 'func', isCorrect: false },
          { id: 'c', text: 'function', isCorrect: false },
          { id: 'd', text: 'define', isCorrect: false }
        ], explanation: 'Python uses "def" keyword to define functions', difficulty: 'easy' },
        { id: '3', topic: 'Python', question: 'What type is returned by the range() function?', options: [
          { id: 'a', text: 'list', isCorrect: false },
          { id: 'b', text: 'range', isCorrect: true },
          { id: 'c', text: 'tuple', isCorrect: false },
          { id: 'd', text: 'array', isCorrect: false }
        ], explanation: 'range() returns a range object, not a list', difficulty: 'easy' },
        { id: '4', topic: 'Python', question: 'How do you create a list in Python?', options: [
          { id: 'a', text: '()' , isCorrect: false },
          { id: 'b', text: '{}', isCorrect: false },
          { id: 'c', text: '[]', isCorrect: true },
          { id: 'd', text: '<>', isCorrect: false }
        ], explanation: 'Square brackets [] are used to create lists', difficulty: 'easy' },
        { id: '5', topic: 'Python', question: 'What is the correct file extension for Python files?', options: [
          { id: 'a', text: '.py', isCorrect: true },
          { id: 'b', text: '.python', isCorrect: false },
          { id: 'c', text: '.p', isCorrect: false },
          { id: 'd', text: '.pyn', isCorrect: false }
        ], explanation: '.py is the standard Python file extension', difficulty: 'easy' }
      ],
      'JavaScript': [
        { id: '1', topic: 'JavaScript', question: 'What is the correct way to declare a variable in JavaScript?', options: [
          { id: 'a', text: 'var x = 5;', isCorrect: true },
          { id: 'b', text: 'x = 5;', isCorrect: false },
          { id: 'c', text: 'declare x = 5;', isCorrect: false },
          { id: 'd', text: 'variable x = 5;', isCorrect: false }
        ], explanation: 'var, let, and const are valid for modern JavaScript. var was the original', difficulty: 'easy' },
        { id: '2', topic: 'JavaScript', question: 'Which operator is used for comparison in JavaScript?', options: [
          { id: 'a', text: '=', isCorrect: false },
          { id: 'b', text: '==', isCorrect: true },
          { id: 'c', text: '===', isCorrect: true },
          { id: 'd', text: '!=', isCorrect: false }
        ], explanation: '== and === are comparison operators. === is strict comparison', difficulty: 'easy' },
        { id: '3', topic: 'JavaScript', question: 'What does JSON stand for?', options: [
          { id: 'a', text: 'Java Server Object Notation', isCorrect: false },
          { id: 'b', text: 'JavaScript Object Notation', isCorrect: true },
          { id: 'c', text: 'JavaScript Online Network', isCorrect: false },
          { id: 'd', text: 'Java String Object Node', isCorrect: false }
        ], explanation: 'JSON stands for JavaScript Object Notation', difficulty: 'easy' },
        { id: '4', topic: 'JavaScript', question: 'How do you call a function named myFunc?', options: [
          { id: 'a', text: 'call myFunc()', isCorrect: false },
          { id: 'b', text: 'myFunc()', isCorrect: true },
          { id: 'c', text: 'invoke myFunc()', isCorrect: false },
          { id: 'd', text: 'function myFunc()', isCorrect: false }
        ], explanation: 'Functions are called using their name followed by ()', difficulty: 'easy' },
        { id: '5', topic: 'JavaScript', question: 'Which of these is a primitive data type in JavaScript?', options: [
          { id: 'a', text: 'Array', isCorrect: false },
          { id: 'b', text: 'Object', isCorrect: false },
          { id: 'c', text: 'String', isCorrect: true },
          { id: 'd', text: 'Function', isCorrect: false }
        ], explanation: 'String is a primitive type. Array, Object, and Function are not primitive', difficulty: 'medium' }
      ],
      'Data Structures': [
        { id: '1', topic: 'Data Structures', question: 'What is the time complexity of accessing an element in an array?', options: [
          { id: 'a', text: 'O(n)', isCorrect: false },
          { id: 'b', text: 'O(log n)', isCorrect: false },
          { id: 'c', text: 'O(1)', isCorrect: true },
          { id: 'd', text: 'O(n^2)', isCorrect: false }
        ], explanation: 'Array access is O(1) - constant time via index', difficulty: 'easy' },
        { id: '2', topic: 'Data Structures', question: 'Which data structure follows LIFO (Last In First Out)?', options: [
          { id: 'a', text: 'Queue', isCorrect: false },
          { id: 'b', text: 'Stack', isCorrect: true },
          { id: 'c', text: 'Tree', isCorrect: false },
          { id: 'd', text: 'Graph', isCorrect: false }
        ], explanation: 'Stack follows LIFO principle', difficulty: 'easy' },
        { id: '3', topic: 'Data Structures', question: 'What is the time complexity of inserting in a sorted array?', options: [
          { id: 'a', text: 'O(1)', isCorrect: false },
          { id: 'b', text: 'O(log n)', isCorrect: false },
          { id: 'c', text: 'O(n)', isCorrect: true },
          { id: 'd', text: 'O(n log n)', isCorrect: false }
        ], explanation: 'Insertion in sorted array requires shifting elements', difficulty: 'medium' },
        { id: '4', topic: 'Data Structures', question: 'Which data structure uses nodes with pointers?', options: [
          { id: 'a', text: 'Array', isCorrect: false },
          { id: 'b', text: 'Linked List', isCorrect: true },
          { id: 'c', text: 'Heap', isCorrect: false },
          { id: 'd', text: 'Hash Table', isCorrect: false }
        ], explanation: 'Linked lists use nodes connected by pointers', difficulty: 'easy' },
        { id: '5', topic: 'Data Structures', question: 'What is a Hash Map used for?', options: [
          { id: 'a', text: 'Sorting data', isCorrect: false },
          { id: 'b', text: 'Key-value pair storage', isCorrect: true },
          { id: 'c', text: 'Sequential access', isCorrect: false },
          { id: 'd', text: 'Tree traversal', isCorrect: false }
        ], explanation: 'Hash Maps store key-value pairs for O(1) lookup', difficulty: 'easy' }
      ],
      'Algorithms': [
        { id: '1', topic: 'Algorithms', question: 'What is the time complexity of Binary Search?', options: [
          { id: 'a', text: 'O(n)', isCorrect: false },
          { id: 'b', text: 'O(log n)', isCorrect: true },
          { id: 'c', text: 'O(n^2)', isCorrect: false },
          { id: 'd', text: 'O(1)', isCorrect: false }
        ], explanation: 'Binary search divides search space by half each time', difficulty: 'easy' },
        { id: '2', topic: 'Algorithms', question: 'What is the worst-case time complexity of Quicksort?', options: [
          { id: 'a', text: 'O(n log n)', isCorrect: false },
          { id: 'b', text: 'O(n)', isCorrect: false },
          { id: 'c', text: 'O(n^2)', isCorrect: true },
          { id: 'd', text: 'O(log n)', isCorrect: false }
        ], explanation: 'Quicksort worst case is O(n^2) when pivot is always smallest/largest', difficulty: 'medium' },
        { id: '3', topic: 'Algorithms', question: 'Which sorting algorithm is stable?', options: [
          { id: 'a', text: 'Quicksort', isCorrect: false },
          { id: 'b', text: 'Merge Sort', isCorrect: true },
          { id: 'c', text: 'Heap Sort', isCorrect: false },
          { id: 'd', text: 'Shell Sort', isCorrect: false }
        ], explanation: 'Merge Sort maintains relative order of equal elements', difficulty: 'medium' },
        { id: '4', topic: 'Algorithms', question: 'What does DFS stand for?', options: [
          { id: 'a', text: 'Depth First Search', isCorrect: true },
          { id: 'b', text: 'Dynamic First Sort', isCorrect: false },
          { id: 'c', text: 'Directed Forward Search', isCorrect: false },
          { id: 'd', text: 'Data Flow System', isCorrect: false }
        ], explanation: 'DFS is a graph traversal algorithm', difficulty: 'easy' },
        { id: '5', topic: 'Algorithms', question: 'BFS uses which data structure?', options: [
          { id: 'a', text: 'Stack', isCorrect: false },
          { id: 'b', text: 'Queue', isCorrect: true },
          { id: 'c', text: 'Array', isCorrect: false },
          { id: 'd', text: 'Heap', isCorrect: false }
        ], explanation: 'BFS (Breadth First Search) uses a queue', difficulty: 'easy' }
      ],
      'Strings': [
        { id: '1', topic: 'Strings', question: 'What is the time complexity of finding a substring using naive method?', options: [
          { id: 'a', text: 'O(n)', isCorrect: false },
          { id: 'b', text: 'O(n*m)', isCorrect: true },
          { id: 'c', text: 'O(log n)', isCorrect: false },
          { id: 'd', text: 'O(1)', isCorrect: false }
        ], explanation: 'Naive string matching is O(n*m) where n is text length and m is pattern', difficulty: 'medium' },
        { id: '2', topic: 'Strings', question: 'What is the reverse of "hello"?', options: [
          { id: 'a', text: 'olleh', isCorrect: true },
          { id: 'b', text: 'lehlo', isCorrect: false },
          { id: 'c', text: 'elloh', isCorrect: false },
          { id: 'd', text: 'holel', isCorrect: false }
        ], explanation: 'Reversing "hello" gives "olleh"', difficulty: 'easy' },
        { id: '3', topic: 'Strings', question: 'What is an anagram?', options: [
          { id: 'a', text: 'Same spelling', isCorrect: false },
          { id: 'b', text: 'Rearrangement of letters', isCorrect: true },
          { id: 'c', text: 'Prefix of word', isCorrect: false },
          { id: 'd', text: 'Suffix of word', isCorrect: false }
        ], explanation: 'Anagrams are rearrangements using same letters', difficulty: 'easy' },
        { id: '4', topic: 'Strings', question: 'What is a palindrome?', options: [
          { id: 'a', text: 'String in reverse', isCorrect: true },
          { id: 'b', text: 'Long string', isCorrect: false },
          { id: 'c', text: 'Short string', isCorrect: false },
          { id: 'd', text: 'Random string', isCorrect: false }
        ], explanation: 'Palindrome reads same forwards and backwards', difficulty: 'easy' },
        { id: '5', topic: 'Strings', question: 'KMP algorithm is used for?', options: [
          { id: 'a', text: 'Sorting strings', isCorrect: false },
          { id: 'b', text: 'Pattern matching', isCorrect: true },
          { id: 'c', text: 'Reversing strings', isCorrect: false },
          { id: 'd', text: 'Comparing strings', isCorrect: false }
        ], explanation: 'KMP (Knuth-Morris-Pratt) is an efficient pattern matching algorithm', difficulty: 'medium' }
      ],
      'Trees/Graphs': [
        { id: '1', topic: 'Trees/Graphs', question: 'What is a Binary Search Tree?', options: [
          { id: 'a', text: 'Tree where left < parent < right', isCorrect: true },
          { id: 'b', text: 'Tree with only 2 children', isCorrect: false },
          { id: 'c', text: 'Tree with all leaves at same level', isCorrect: false },
          { id: 'd', text: 'Random tree structure', isCorrect: false }
        ], explanation: 'BST maintains left < parent < right property', difficulty: 'easy' },
        { id: '2', topic: 'Trees/Graphs', question: 'What is height of a balanced tree?', options: [
          { id: 'a', text: 'O(n)', isCorrect: false },
          { id: 'b', text: 'O(log n)', isCorrect: true },
          { id: 'c', text: 'O(1)', isCorrect: false },
          { id: 'd', text: 'O(n^2)', isCorrect: false }
        ], explanation: 'Balanced trees have O(log n) height', difficulty: 'medium' },
        { id: '3', topic: 'Trees/Graphs', question: 'What is tree traversal In-order?', options: [
          { id: 'a', text: 'Left-Root-Right', isCorrect: true },
          { id: 'b', text: 'Root-Left-Right', isCorrect: false },
          { id: 'c', text: 'Left-Right-Root', isCorrect: false },
          { id: 'd', text: 'Right-Root-Left', isCorrect: false }
        ], explanation: 'In-order traversal visits Left, then Root, then Right', difficulty: 'medium' },
        { id: '4', topic: 'Trees/Graphs', question: 'What is a cycle in a graph?', options: [
          { id: 'a', text: 'Path from node to itself', isCorrect: true },
          { id: 'b', text: 'Connected components', isCorrect: false },
          { id: 'c', text: 'Multiple edges', isCorrect: false },
          { id: 'd', text: 'Directed path', isCorrect: false }
        ], explanation: 'A cycle is a path that starts and ends at the same node', difficulty: 'medium' },
        { id: '5', topic: 'Trees/Graphs', question: 'What is a spanning tree?', options: [
          { id: 'a', text: 'Tree containing all vertices', isCorrect: true },
          { id: 'b', text: 'Tree with minimum edges', isCorrect: false },
          { id: 'c', text: 'Complete graph', isCorrect: false },
          { id: 'd', text: 'Cyclic tree', isCorrect: false }
        ], explanation: 'Spanning tree connects all vertices without cycles', difficulty: 'medium' }
      ],
      'DP': [
        { id: '1', topic: 'DP', question: 'What does DP stand for?', options: [
          { id: 'a', text: 'Data Processing', isCorrect: false },
          { id: 'b', text: 'Dynamic Programming', isCorrect: true },
          { id: 'c', text: 'Direct Path', isCorrect: false },
          { id: 'd', text: 'Digital Pattern', isCorrect: false }
        ], explanation: 'DP stands for Dynamic Programming', difficulty: 'easy' },
        { id: '2', topic: 'DP', question: 'Fibonacci using DP has time complexity?', options: [
          { id: 'a', text: 'O(2^n)', isCorrect: false },
          { id: 'b', text: 'O(n)', isCorrect: true },
          { id: 'c', text: 'O(log n)', isCorrect: false },
          { id: 'd', text: 'O(n^2)', isCorrect: false }
        ], explanation: 'DP Fibonacci is O(n) with memoization', difficulty: 'medium' },
        { id: '3', topic: 'DP', question: 'What is memoization?', options: [
          { id: 'a', text: 'Forgetting values', isCorrect: false },
          { id: 'b', text: 'Storing computed results', isCorrect: true },
          { id: 'c', text: 'Sorting values', isCorrect: false },
          { id: 'd', text: 'Creating loops', isCorrect: false }
        ], explanation: 'Memoization caches results to avoid recomputation', difficulty: 'easy' },
        { id: '4', topic: 'DP', question: '0/1 Knapsack is solved using?', options: [
          { id: 'a', text: 'Greedy', isCorrect: false },
          { id: 'b', text: 'Dynamic Programming', isCorrect: true },
          { id: 'c', text: 'Recursion', isCorrect: false },
          { id: 'd', text: 'Sorting', isCorrect: false }
        ], explanation: '0/1 Knapsack requires DP for optimal solution', difficulty: 'medium' },
        { id: '5', topic: 'DP', question: 'What is bottom-up DP?', options: [
          { id: 'a', text: 'Start from largest subproblem', isCorrect: false },
          { id: 'b', text: 'Start from base case', isCorrect: true },
          { id: 'c', text: 'Random order', isCorrect: false },
          { id: 'd', text: 'No specific order', isCorrect: false }
        ], explanation: 'Bottom-up DP solves smaller subproblems first', difficulty: 'medium' }
      ],
      'Interview': [
        { id: '1', topic: 'Interview', question: 'What is the most important coding skill?', options: [
          { id: 'a', text: 'Speed', isCorrect: false },
          { id: 'b', text: 'Problem-solving logic', isCorrect: true },
          { id: 'c', text: 'Code length', isCorrect: false },
          { id: 'd', text: 'Syntax knowledge', isCorrect: false }
        ], explanation: 'Logic and problem-solving are crucial for interviews', difficulty: 'easy' },
        { id: '2', topic: 'Interview', question: 'How to approach LeetCode problems?', options: [
          { id: 'a', text: 'Code first', isCorrect: false },
          { id: 'b', text: 'Understand, plan, code', isCorrect: true },
          { id: 'c', text: 'Copy solutions', isCorrect: false },
          { id: 'd', text: 'Random approach', isCorrect: false }
        ], explanation: 'Best approach: understand problem, plan solution, then code', difficulty: 'easy' },
        { id: '3', topic: 'Interview', question: 'What is Big O complexity?', options: [
          { id: 'a', text: 'Program speed', isCorrect: false },
          { id: 'b', text: 'Algorithm efficiency', isCorrect: true },
          { id: 'c', text: 'Code quality', isCorrect: false },
          { id: 'd', text: 'Syntax correctness', isCorrect: false }
        ], explanation: 'Big O describes algorithm efficiency in terms of input size', difficulty: 'medium' },
        { id: '4', topic: 'Interview', question: 'When should you optimize code?', options: [
          { id: 'a', text: 'Always at start', isCorrect: false },
          { id: 'b', text: 'After it works correctly', isCorrect: true },
          { id: 'c', text: 'Never', isCorrect: false },
          { id: 'd', text: 'Randomly', isCorrect: false }
        ], explanation: 'First make it work, then optimize if needed', difficulty: 'medium' },
        { id: '5', topic: 'Interview', question: 'How to communicate during interviews?', options: [
          { id: 'a', text: 'Stay silent', isCorrect: false },
          { id: 'b', text: 'Think out loud, ask questions', isCorrect: true },
          { id: 'c', text: 'Copy online solutions', isCorrect: false },
          { id: 'd', text: 'Rush through', isCorrect: false }
        ], explanation: 'Communication and collaboration are key in interviews', difficulty: 'medium' }
      ],
      'System Design': [
        { id: '1', topic: 'System Design', question: 'What is scalability?', options: [
          { id: 'a', text: 'System speed', isCorrect: false },
          { id: 'b', text: 'Handling increased load', isCorrect: true },
          { id: 'c', text: 'System reliability', isCorrect: false },
          { id: 'd', text: 'Data storage', isCorrect: false }
        ], explanation: 'Scalability means system can handle growth', difficulty: 'easy' },
        { id: '2', topic: 'System Design', question: 'What is caching?', options: [
          { id: 'a', text: 'Storing all data', isCorrect: false },
          { id: 'b', text: 'Storing frequently accessed data', isCorrect: true },
          { id: 'c', text: 'Deleting data', isCorrect: false },
          { id: 'd', text: 'Encrypting data', isCorrect: false }
        ], explanation: 'Cache stores frequently used data for faster access', difficulty: 'easy' },
        { id: '3', topic: 'System Design', question: 'What is load balancing?', options: [
          { id: 'a', text: 'Balancing database', isCorrect: false },
          { id: 'b', text: 'Distributing traffic across servers', isCorrect: true },
          { id: 'c', text: 'Balancing code', isCorrect: false },
          { id: 'd', text: 'Balancing users', isCorrect: false }
        ], explanation: 'Load balancing distributes network traffic across multiple servers', difficulty: 'medium' },
        { id: '4', topic: 'System Design', question: 'What is horizontal scaling?', options: [
          { id: 'a', text: 'Adding more power to server', isCorrect: false },
          { id: 'b', text: 'Adding more servers', isCorrect: true },
          { id: 'c', text: 'Increasing memory', isCorrect: false },
          { id: 'd', text: 'Upgrading CPU', isCorrect: false }
        ], explanation: 'Horizontal scaling means adding more servers', difficulty: 'medium' },
        { id: '5', topic: 'System Design', question: 'What is a microservice?', options: [
          { id: 'a', text: 'Small code snippet', isCorrect: false },
          { id: 'b', text: 'Independently deployable service', isCorrect: true },
          { id: 'c', text: 'Small database', isCorrect: false },
          { id: 'd', text: 'Tiny function', isCorrect: false }
        ], explanation: 'Microservices are independently deployable services', difficulty: 'medium' }
      ],
      'Web Dev': [
        { id: '1', topic: 'Web Dev', question: 'What is HTML?', options: [
          { id: 'a', text: 'Programming language', isCorrect: false },
          { id: 'b', text: 'Markup language for structure', isCorrect: true },
          { id: 'c', text: 'Styling language', isCorrect: false },
          { id: 'd', text: 'Database language', isCorrect: false }
        ], explanation: 'HTML is used to create web page structure', difficulty: 'easy' },
        { id: '2', topic: 'Web Dev', question: 'What is CSS used for?', options: [
          { id: 'a', text: 'Structure', isCorrect: false },
          { id: 'b', text: 'Styling and layout', isCorrect: true },
          { id: 'c', text: 'Logic', isCorrect: false },
          { id: 'd', text: 'Data storage', isCorrect: false }
        ], explanation: 'CSS is used for styling and layout of web pages', difficulty: 'easy' },
        { id: '3', topic: 'Web Dev', question: 'What is responsive design?', options: [
          { id: 'a', text: 'Fast loading', isCorrect: false },
          { id: 'b', text: 'Adapts to screen size', isCorrect: true },
          { id: 'c', text: 'Many features', isCorrect: false },
          { id: 'd', text: 'Server response', isCorrect: false }
        ], explanation: 'Responsive design adapts to different screen sizes', difficulty: 'easy' },
        { id: '4', topic: 'Web Dev', question: 'What is DOM?', options: [
          { id: 'a', text: 'Data Object Model', isCorrect: false },
          { id: 'b', text: 'Document Object Model', isCorrect: true },
          { id: 'c', text: 'Digital Online Module', isCorrect: false },
          { id: 'd', text: 'Data Organization Method', isCorrect: false }
        ], explanation: 'DOM represents the structure of HTML document', difficulty: 'medium' },
        { id: '5', topic: 'Web Dev', question: 'What is REST API?', options: [
          { id: 'a', text: 'Sleeping API', isCorrect: false },
          { id: 'b', text: 'Architectural style for APIs', isCorrect: true },
          { id: 'c', text: 'Random API', isCorrect: false },
          { id: 'd', text: 'Real-time API', isCorrect: false }
        ], explanation: 'REST is an architectural style using HTTP for APIs', difficulty: 'medium' }
      ],
      'Java': [
        { id: '1', topic: 'Java', question: 'What is JVM?', options: [
          { id: 'a', text: 'Java Virtual Machine', isCorrect: true },
          { id: 'b', text: 'Java Version Manager', isCorrect: false },
          { id: 'c', text: 'Java Value Manager', isCorrect: false },
          { id: 'd', text: 'Java View Module', isCorrect: false }
        ], explanation: 'JVM executes Java bytecode', difficulty: 'easy' },
        { id: '2', topic: 'Java', question: 'Is Java platform-dependent?', options: [
          { id: 'a', text: 'Yes', isCorrect: false },
          { id: 'b', text: 'No, write once run anywhere', isCorrect: true },
          { id: 'c', text: 'Sometimes', isCorrect: false },
          { id: 'd', text: 'Always dependent', isCorrect: false }
        ], explanation: 'Java is platform-independent due to JVM', difficulty: 'easy' },
        { id: '3', topic: 'Java', question: 'What is an exception?', options: [
          { id: 'a', text: 'Event during execution', isCorrect: true },
          { id: 'b', text: 'Error in syntax', isCorrect: false },
          { id: 'c', text: 'Warning message', isCorrect: false },
          { id: 'd', text: 'Comment', isCorrect: false }
        ], explanation: 'Exception is an event that occurs during execution', difficulty: 'medium' },
        { id: '4', topic: 'Java', question: 'What is inheritance in OOP?', options: [
          { id: 'a', text: 'Getting parent properties', isCorrect: true },
          { id: 'b', text: 'Creating new object', isCorrect: false },
          { id: 'c', text: 'Copying code', isCorrect: false },
          { id: 'd', text: 'Method overloading', isCorrect: false }
        ], explanation: 'Inheritance allows class to inherit from another class', difficulty: 'medium' },
        { id: '5', topic: 'Java', question: 'What is polymorphism?', options: [
          { id: 'a', text: 'Multiple forms', isCorrect: true },
          { id: 'b', text: 'Single method', isCorrect: false },
          { id: 'c', text: 'Static behavior', isCorrect: false },
          { id: 'd', text: 'Private methods', isCorrect: false }
        ], explanation: 'Polymorphism allows objects to take multiple forms', difficulty: 'medium' }
      ],
      'SQL': [
        { id: '1', topic: 'SQL', question: 'What does SQL stand for?', options: [
          { id: 'a', text: 'Structured Query Language', isCorrect: true },
          { id: 'b', text: 'Strong Query Logic', isCorrect: false },
          { id: 'c', text: 'Simple Question Language', isCorrect: false },
          { id: 'd', text: 'Server Query Language', isCorrect: false }
        ], explanation: 'SQL stands for Structured Query Language', difficulty: 'easy' },
        { id: '2', topic: 'SQL', question: 'What is a primary key?', options: [
          { id: 'a', text: 'Any column', isCorrect: false },
          { id: 'b', text: 'Unique identifier for record', isCorrect: true },
          { id: 'c', text: 'Foreign key', isCorrect: false },
          { id: 'd', text: 'Password key', isCorrect: false }
        ], explanation: 'Primary key uniquely identifies a record', difficulty: 'easy' },
        { id: '3', topic: 'SQL', question: 'What is normalization?', options: [
          { id: 'a', text: 'Making data average', isCorrect: false },
          { id: 'b', text: 'Organizing data efficiently', isCorrect: true },
          { id: 'c', text: 'Deleting duplicate', isCorrect: false },
          { id: 'd', text: 'Sorting data', isCorrect: false }
        ], explanation: 'Normalization reduces data redundancy and improves integrity', difficulty: 'medium' },
        { id: '4', topic: 'SQL', question: 'What is a foreign key?', options: [
          { id: 'a', text: 'Key to another table', isCorrect: true },
          { id: 'b', text: 'Backup key', isCorrect: false },
          { id: 'c', text: 'Encryption key', isCorrect: false },
          { id: 'd', text: 'API key', isCorrect: false }
        ], explanation: 'Foreign key references a primary key in another table', difficulty: 'medium' },
        { id: '5', topic: 'SQL', question: 'What is ACID?', options: [
          { id: 'a', text: 'Chemical element', isCorrect: false },
          { id: 'b', text: 'Transaction properties', isCorrect: true },
          { id: 'c', text: 'Data type', isCorrect: false },
          { id: 'd', text: 'Query optimizer', isCorrect: false }
        ], explanation: 'ACID: Atomicity, Consistency, Isolation, Durability', difficulty: 'medium' }
      ],
      'Version Control': [
        { id: '1', topic: 'Version Control', question: 'What is Git?', options: [
          { id: 'a', text: 'Version control system', isCorrect: true },
          { id: 'b', text: 'Programming language', isCorrect: false },
          { id: 'c', text: 'Database', isCorrect: false },
          { id: 'd', text: 'Web framework', isCorrect: false }
        ], explanation: 'Git is a distributed version control system', difficulty: 'easy' },
        { id: '2', topic: 'Version Control', question: 'What is a commit?', options: [
          { id: 'a', text: 'Pushing code', isCorrect: false },
          { id: 'b', text: 'Saving changes', isCorrect: true },
          { id: 'c', text: 'Merging branches', isCorrect: false },
          { id: 'd', text: 'Creating branch', isCorrect: false }
        ], explanation: 'Commit saves changes to repository with a message', difficulty: 'easy' },
        { id: '3', topic: 'Version Control', question: 'What is a branch?', options: [
          { id: 'a', text: 'Copy of repository', isCorrect: true },
          { id: 'b', text: 'Single file', isCorrect: false },
          { id: 'c', text: 'Backup system', isCorrect: false },
          { id: 'd', text: 'Deleted code', isCorrect: false }
        ], explanation: 'Branch is an independent line of development', difficulty: 'easy' },
        { id: '4', topic: 'Version Control', question: 'What is merge?', options: [
          { id: 'a', text: 'Deleting code', isCorrect: false },
          { id: 'b', text: 'Combining branches', isCorrect: true },
          { id: 'c', text: 'Creating backup', isCorrect: false },
          { id: 'd', text: 'Pushing online', isCorrect: false }
        ], explanation: 'Merge combines changes from different branches', difficulty: 'medium' },
        { id: '5', topic: 'Version Control', question: 'What is pull request?', options: [
          { id: 'a', text: 'Downloading code', isCorrect: false },
          { id: 'b', text: 'Proposing changes for review', isCorrect: true },
          { id: 'c', text: 'Deleting branch', isCorrect: false },
          { id: 'd', text: 'Creating issue', isCorrect: false }
        ], explanation: 'Pull request proposes changes and enables code review', difficulty: 'medium' }
      ],
      'Full Stack': [
        { id: '1', topic: 'Full Stack', question: 'What is frontend?', options: [
          { id: 'a', text: 'Database', isCorrect: false },
          { id: 'b', text: 'User interface', isCorrect: true },
          { id: 'c', text: 'Server logic', isCorrect: false },
          { id: 'd', text: 'API gateway', isCorrect: false }
        ], explanation: 'Frontend is the client-side user interface', difficulty: 'easy' },
        { id: '2', topic: 'Full Stack', question: 'What is backend?', options: [
          { id: 'a', text: 'CSS styling', isCorrect: false },
          { id: 'b', text: 'Server and database logic', isCorrect: true },
          { id: 'c', text: 'HTML structure', isCorrect: false },
          { id: 'd', text: 'Browser', isCorrect: false }
        ], explanation: 'Backend handles server-side logic and data', difficulty: 'easy' },
        { id: '3', topic: 'Full Stack', question: 'What is MVC?', options: [
          { id: 'a', text: 'Model-View-Controller', isCorrect: true },
          { id: 'b', text: 'Model-Version-Client', isCorrect: false },
          { id: 'c', text: 'Memory-View-Cache', isCorrect: false },
          { id: 'd', text: 'Module-Variable-Context', isCorrect: false }
        ], explanation: 'MVC is an architectural pattern for building applications', difficulty: 'medium' },
        { id: '4', topic: 'Full Stack', question: 'What is authentication?', options: [
          { id: 'a', text: 'Accessing resources', isCorrect: false },
          { id: 'b', text: 'Verifying user identity', isCorrect: true },
          { id: 'c', text: 'Encrypting data', isCorrect: false },
          { id: 'd', text: 'Logging errors', isCorrect: false }
        ], explanation: 'Authentication verifies that user is who they claim to be', difficulty: 'medium' },
        { id: '5', topic: 'Full Stack', question: 'What is CORS?', options: [
          { id: 'a', text: 'Cross Origin Resource Sharing', isCorrect: true },
          { id: 'b', text: 'Client Order Request System', isCorrect: false },
          { id: 'c', text: 'Content-based Routing', isCorrect: false },
          { id: 'd', text: 'Cache Origin Response', isCorrect: false }
        ], explanation: 'CORS allows cross-origin requests in web applications', difficulty: 'medium' }
      ],
      'Problem Solving': [
        { id: '1', topic: 'Problem Solving', question: 'First step in problem solving?', options: [
          { id: 'a', text: 'Start coding', isCorrect: false },
          { id: 'b', text: 'Understand the problem', isCorrect: true },
          { id: 'c', text: 'Copy solution', isCorrect: false },
          { id: 'd', text: 'Ask for help', isCorrect: false }
        ], explanation: 'Understanding the problem is the crucial first step', difficulty: 'easy' },
        { id: '2', topic: 'Problem Solving', question: 'What is brute force?', options: [
          { id: 'a', text: 'Optimized solution', isCorrect: false },
          { id: 'b', text: 'Try all possibilities', isCorrect: true },
          { id: 'c', text: 'Using recursion', isCorrect: false },
          { id: 'd', text: 'Divide and conquer', isCorrect: false }
        ], explanation: 'Brute force tries all possible solutions', difficulty: 'easy' },
        { id: '3', topic: 'Problem Solving', question: 'What is divide and conquer?', options: [
          { id: 'a', text: 'Breaking into smaller parts', isCorrect: true },
          { id: 'b', text: 'Linear search', isCorrect: false },
          { id: 'c', text: 'Greedy approach', isCorrect: false },
          { id: 'd', text: 'Backtracking', isCorrect: false }
        ], explanation: 'Divide and conquer breaks problem into smaller subproblems', difficulty: 'medium' },
        { id: '4', topic: 'Problem Solving', question: 'When to use greedy algorithm?', options: [
          { id: 'a', text: 'Always', isCorrect: false },
          { id: 'b', text: 'When local optimum is global optimum', isCorrect: true },
          { id: 'c', text: 'For sorting only', isCorrect: false },
          { id: 'd', text: 'Never', isCorrect: false }
        ], explanation: 'Greedy works when local decisions lead to global optimum', difficulty: 'medium' },
        { id: '5', topic: 'Problem Solving', question: 'What is backtracking?', options: [
          { id: 'a', text: 'Going back to previous line', isCorrect: false },
          { id: 'b', text: 'Exploring and undoing choices', isCorrect: true },
          { id: 'c', text: 'Debugging code', isCorrect: false },
          { id: 'd', text: 'Version control', isCorrect: false }
        ], explanation: 'Backtracking explores paths and undoes wrong choices', difficulty: 'medium' }
      ]
    };

    const questions = questionsMap[topic] || [];
    return of(questions).pipe(
      catchError(error => {
        console.error('Error fetching MCQ questions:', error);
        return of([]);
      })
    );
  }

  /**
   * Get all practice content
   */
  getAllPracticeContent() {
    return {
      algorithmChallenges$: this.getAlgorithmChallenges(),
      beginnerExercises$: this.getBeginnerExercises(),
      speedCoding$: this.getSpeedCoding(),
      skillAssessments$: this.getSkillAssessments()
    };
  }
}
