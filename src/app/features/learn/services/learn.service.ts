import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  language: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  url?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  acceptance_rate?: number;
  leetcodeUrl?: string;
}

export interface Documentation {
  id: string;
  title: string;
  description: string;
  language: string;
  official_url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LearnService {
  // Using multiple public APIs for coding content
  private readonly apiBaseUrls = {
    codeWars: 'https://www.codewars.com/api/v1',
    rapidApi: 'https://api.api-ninjas.com/v1'
  };

  constructor(private http: HttpClient) {}

  /**
   * Fetch tutorials from CodeWars
   */
  getTutorials(): Observable<Tutorial[]> {
    const tutorials: Tutorial[] = [
      {
        id: '1',
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript including variables, functions, and control flow',
        language: 'JavaScript',
        difficulty: 'beginner',
        duration: '4 hours',
        url: 'https://www.codewars.com/docs'
      },
      {
        id: '2',
        title: 'Advanced TypeScript Patterns',
        description: 'Master advanced TypeScript concepts like generics, decorators, and utility types',
        language: 'TypeScript',
        difficulty: 'advanced',
        duration: '6 hours',
        url: 'https://www.typescriptlang.org/docs/'
      },
      {
        id: '3',
        title: 'Angular Component Development',
        description: 'Build reusable and maintainable Angular components with best practices',
        language: 'Angular',
        difficulty: 'intermediate',
        duration: '5 hours',
        url: 'https://angular.io/guide/component-overview'
      },
      {
        id: '4',
        title: 'React Hooks Deep Dive',
        description: 'Understand React Hooks and how to build custom hooks for state management',
        language: 'React',
        difficulty: 'intermediate',
        duration: '4 hours',
        url: 'https://react.dev/reference/react/hooks'
      },
      {
        id: '5',
        title: 'Python for Data Science',
        description: 'Learn Python with libraries like NumPy, Pandas, and Matplotlib for data analysis',
        language: 'Python',
        difficulty: 'beginner',
        duration: '8 hours',
        url: 'https://docs.python.org/'
      },
      {
        id: '6',
        title: 'Node.js Backend Development',
        description: 'Build scalable backend applications with Node.js and Express',
        language: 'Node.js',
        difficulty: 'intermediate',
        duration: '6 hours',
        url: 'https://nodejs.org/en/docs/'
      }
    ];
    return of(tutorials).pipe(
      catchError(error => {
        console.error('Error fetching tutorials:', error);
        return of([]);
      })
    );
  }

  /**
   * Fetch coding challenges (100 LeetCode problems)
   */
  getChallenges(): Observable<Challenge[]> {
    const challenges: Challenge[] = [
      // Easy Problems (1-40)
      { id: '1', title: 'Two Sum', description: 'Find two numbers that add up to target', difficulty: 'easy', category: 'Array', acceptance_rate: 48, leetcodeUrl: 'https://leetcode.com/problems/two-sum/' },
      { id: '2', title: 'Reverse String', description: 'Reverse a string in-place', difficulty: 'easy', category: 'String', acceptance_rate: 87, leetcodeUrl: 'https://leetcode.com/problems/reverse-string/' },
      { id: '3', title: 'Palindrome String', description: 'Check if string is palindrome', difficulty: 'easy', category: 'String', acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/valid-palindrome/' },
      { id: '4', title: 'Contains Duplicate', description: 'Check if array contains duplicates', difficulty: 'easy', category: 'Array', acceptance_rate: 61, leetcodeUrl: 'https://leetcode.com/problems/contains-duplicate/' },
      { id: '5', title: 'Merge Sorted Array', description: 'Merge two sorted arrays', difficulty: 'easy', category: 'Array', acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/merge-sorted-array/' },
      { id: '6', title: 'Remove Duplicates', description: 'Remove duplicates from sorted array', difficulty: 'easy', category: 'Array', acceptance_rate: 53, leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-array/' },
      { id: '7', title: 'Best Time to Buy Stock', description: 'Find best time to buy and sell stock', difficulty: 'easy', category: 'Array', acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/' },
      { id: '8', title: 'Valid Parentheses', description: 'Check if parentheses are valid', difficulty: 'easy', category: 'Stack', acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/valid-parentheses/' },
      { id: '9', title: 'Majority Element', description: 'Find element appearing more than n/2 times', difficulty: 'easy', category: 'Array', acceptance_rate: 64, leetcodeUrl: 'https://leetcode.com/problems/majority-element/' },
      { id: '10', title: 'Climbing Stairs', description: 'Count ways to climb n stairs', difficulty: 'easy', category: 'DP', acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/climbing-stairs/' },
      { id: '11', title: 'First Unique Character', description: 'Find first unique character in string', difficulty: 'easy', category: 'String', acceptance_rate: 59, leetcodeUrl: 'https://leetcode.com/problems/first-unique-character-in-a-string/' },
      { id: '12', title: 'Isomorphic Strings', description: 'Check if two strings are isomorphic', difficulty: 'easy', category: 'String', acceptance_rate: 42, leetcodeUrl: 'https://leetcode.com/problems/isomorphic-strings/' },
      { id: '13', title: 'Excel Sheet Column Number', description: 'Convert column title to number', difficulty: 'easy', category: 'Math', acceptance_rate: 59, leetcodeUrl: 'https://leetcode.com/problems/excel-sheet-column-number/' },
      { id: '14', title: 'Happy Number', description: 'Determine if number is happy', difficulty: 'easy', category: 'Hash Table', acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/happy-number/' },
      { id: '15', title: 'Invert Binary Tree', description: 'Invert a binary tree', difficulty: 'easy', category: 'Tree', acceptance_rate: 78, leetcodeUrl: 'https://leetcode.com/problems/invert-binary-tree/' },
      { id: '16', title: 'Same Tree', description: 'Check if two binary trees are the same', difficulty: 'easy', category: 'Tree', acceptance_rate: 56, leetcodeUrl: 'https://leetcode.com/problems/same-tree/' },
      { id: '17', title: 'Symmetric Tree', description: 'Check if binary tree is symmetric', difficulty: 'easy', category: 'Tree', acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/symmetric-tree/' },
      { id: '18', title: 'Binary Tree Level Order', description: 'Level order traversal of binary tree', difficulty: 'easy', category: 'Tree', acceptance_rate: 65, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-level-order-traversal/' },
      { id: '19', title: 'Minimum Depth Tree', description: 'Find minimum depth of binary tree', difficulty: 'easy', category: 'Tree', acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/minimum-depth-of-binary-tree/' },
      { id: '20', title: 'Path Sum', description: 'Check if path in tree has sum equal to target', difficulty: 'easy', category: 'Tree', acceptance_rate: 42, leetcodeUrl: 'https://leetcode.com/problems/path-sum/' },
      { id: '21', title: 'Valid Anagram', description: 'Check if two strings are anagrams', difficulty: 'easy', category: 'String', acceptance_rate: 65, leetcodeUrl: 'https://leetcode.com/problems/valid-anagram/' },
      { id: '22', title: 'Ransom Note', description: 'Determine if ransom note can be constructed', difficulty: 'easy', category: 'String', acceptance_rate: 59, leetcodeUrl: 'https://leetcode.com/problems/ransom-note/' },
      { id: '23', title: 'Intersection Arrays', description: 'Find intersection of two arrays', difficulty: 'easy', category: 'Array', acceptance_rate: 61, leetcodeUrl: 'https://leetcode.com/problems/intersection-of-two-arrays/' },
      { id: '24', title: 'Happy Number', description: 'Check if a number is happy', difficulty: 'easy', category: 'Math', acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/happy-number/' },
      { id: '25', title: 'Count Primes', description: 'Count primes less than n', difficulty: 'easy', category: 'Math', acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/count-primes/' },
      { id: '26', title: 'Power of Two', description: 'Check if n is power of 2', difficulty: 'easy', category: 'Bit Manipulation', acceptance_rate: 47, leetcodeUrl: 'https://leetcode.com/problems/power-of-two/' },
      { id: '27', title: 'Hamming Distance', description: 'Calculate hamming distance between two integers', difficulty: 'easy', category: 'Bit Manipulation', acceptance_rate: 85, leetcodeUrl: 'https://leetcode.com/problems/hamming-distance/' },
      { id: '28', title: 'Number Complement', description: 'Find complement of a number', difficulty: 'easy', category: 'Bit Manipulation', acceptance_rate: 73, leetcodeUrl: 'https://leetcode.com/problems/number-complement/' },
      { id: '29', title: 'Missing Number', description: 'Find missing number in array', difficulty: 'easy', category: 'Array', acceptance_rate: 60, leetcodeUrl: 'https://leetcode.com/problems/missing-number/' },
      { id: '30', title: 'Single Number', description: 'Find single number appearing once', difficulty: 'easy', category: 'Bit Manipulation', acceptance_rate: 68, leetcodeUrl: 'https://leetcode.com/problems/single-number/' },
      { id: '31', title: 'Majority Element II', description: 'Find elements appearing more than n/3', difficulty: 'easy', category: 'Array', acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/majority-element-ii/' },
      { id: '32', title: 'Integer Break', description: 'Break integer into parts to maximize product', difficulty: 'easy', category: 'Math', acceptance_rate: 48, leetcodeUrl: 'https://leetcode.com/problems/integer-break/' },
      { id: '33', title: 'Linked List Cycle', description: 'Detect cycle in linked list', difficulty: 'easy', category: 'Linked List', acceptance_rate: 45, leetcodeUrl: 'https://leetcode.com/problems/linked-list-cycle/' },
      { id: '34', title: 'Min Stack', description: 'Design stack with min operation', difficulty: 'easy', category: 'Stack', acceptance_rate: 45, leetcodeUrl: 'https://leetcode.com/problems/min-stack/' },
      { id: '35', title: 'Implement Queue', description: 'Implement queue using stacks', difficulty: 'easy', category: 'Queue', acceptance_rate: 60, leetcodeUrl: 'https://leetcode.com/problems/implement-queue-using-stacks/' },
      { id: '36', title: 'Palindrome Linked List', description: 'Check if linked list is palindrome', difficulty: 'easy', category: 'Linked List', acceptance_rate: 43, leetcodeUrl: 'https://leetcode.com/problems/palindrome-linked-list/' },
      { id: '37', title: 'Delete Node in List', description: 'Delete a node from linked list', difficulty: 'easy', category: 'Linked List', acceptance_rate: 82, leetcodeUrl: 'https://leetcode.com/problems/delete-node-in-a-linked-list/' },
      { id: '38', title: 'Reverse Linked List', description: 'Reverse a singly linked list', difficulty: 'easy', category: 'Linked List', acceptance_rate: 63, leetcodeUrl: 'https://leetcode.com/problems/reverse-linked-list/' },
      { id: '39', title: 'Middle of Linked List', description: 'Find middle node of linked list', difficulty: 'easy', category: 'Linked List', acceptance_rate: 76, leetcodeUrl: 'https://leetcode.com/problems/middle-of-the-linked-list/' },
      { id: '40', title: 'Remove Linked List Elements', description: 'Remove elements from linked list', difficulty: 'easy', category: 'Linked List', acceptance_rate: 47, leetcodeUrl: 'https://leetcode.com/problems/remove-linked-list-elements/' },

      // Medium Problems (41-75)
      { id: '41', title: 'Add Two Numbers', description: 'Add two numbers represented as linked lists', difficulty: 'medium', category: 'Linked List', acceptance_rate: 35, leetcodeUrl: 'https://leetcode.com/problems/add-two-numbers/' },
      { id: '42', title: 'Longest Substring', description: 'Find longest substring without repeating chars', difficulty: 'medium', category: 'String', acceptance_rate: 35, leetcodeUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/' },
      { id: '43', title: 'Longest Palindrome Substring', description: 'Find longest palindromic substring', difficulty: 'medium', category: 'String', acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/longest-palindromic-substring/' },
      { id: '44', title: 'ZigZag Conversion', description: 'Convert string in zigzag pattern', difficulty: 'medium', category: 'String', acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/zigzag-conversion/' },
      { id: '45', title: 'Reverse Integer', description: 'Reverse digits of an integer', difficulty: 'medium', category: 'Math', acceptance_rate: 26, leetcodeUrl: 'https://leetcode.com/problems/reverse-integer/' },
      { id: '46', title: 'String to Integer', description: 'Convert string to integer', difficulty: 'medium', category: 'String', acceptance_rate: 15, leetcodeUrl: 'https://leetcode.com/problems/string-to-integer-atoi/' },
      { id: '47', title: 'Container Most Water', description: 'Find two lines containing most water', difficulty: 'medium', category: 'Array', acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/container-with-most-water/' },
      { id: '48', title: '3Sum', description: 'Find all unique triplets that sum to zero', difficulty: 'medium', category: 'Array', acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/3sum/' },
      { id: '49', title: '3Sum Closest', description: 'Find triplet closest to target sum', difficulty: 'medium', category: 'Array', acceptance_rate: 44, leetcodeUrl: 'https://leetcode.com/problems/3sum-closest/' },
      { id: '50', title: 'Letter Combinations', description: 'Generate letter combinations of phone number', difficulty: 'medium', category: 'Backtracking', acceptance_rate: 56, leetcodeUrl: 'https://leetcode.com/problems/letter-combinations-of-a-phone-number/' },
      { id: '51', title: '4Sum', description: 'Find all unique quadruplets that sum to target', difficulty: 'medium', category: 'Array', acceptance_rate: 36, leetcodeUrl: 'https://leetcode.com/problems/4sum/' },
      { id: '52', title: 'Remove Nth Node', description: 'Remove nth node from end of list', difficulty: 'medium', category: 'Linked List', acceptance_rate: 36, leetcodeUrl: 'https://leetcode.com/problems/remove-nth-node-from-end-of-list/' },
      { id: '53', title: 'Generate Parentheses', description: 'Generate all valid parentheses combinations', difficulty: 'medium', category: 'Backtracking', acceptance_rate: 73, leetcodeUrl: 'https://leetcode.com/problems/generate-parentheses/' },
      { id: '54', title: 'Merge K Lists', description: 'Merge k sorted linked lists', difficulty: 'medium', category: 'Linked List', acceptance_rate: 43, leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: '55', title: 'Remove Duplicates Sorted', description: 'Remove duplicates from sorted list', difficulty: 'medium', category: 'Linked List', acceptance_rate: 44, leetcodeUrl: 'https://leetcode.com/problems/remove-duplicates-from-sorted-list-ii/' },
      { id: '56', title: 'Swap Nodes in Pairs', description: 'Swap every two adjacent nodes', difficulty: 'medium', category: 'Linked List', acceptance_rate: 61, leetcodeUrl: 'https://leetcode.com/problems/swap-nodes-in-pairs/' },
      { id: '57', title: 'Reverse Nodes k-Group', description: 'Reverse nodes in k groups', difficulty: 'medium', category: 'Linked List', acceptance_rate: 51, leetcodeUrl: 'https://leetcode.com/problems/reverse-nodes-in-k-group/' },
      { id: '58', title: 'Binary Search', description: 'Search for target in sorted array', difficulty: 'medium', category: 'Array', acceptance_rate: 46, leetcodeUrl: 'https://leetcode.com/problems/binary-search/' },
      { id: '59', title: 'Search in Rotated', description: 'Search in rotated sorted array', difficulty: 'medium', category: 'Array', acceptance_rate: 33, leetcodeUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/' },
      { id: '60', title: 'Find First and Last', description: 'Find first and last position of element', difficulty: 'medium', category: 'Array', acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/find-first-and-last-position-of-element-in-sorted-array/' },
      { id: '61', title: 'Combination Sum', description: 'Find combinations that sum to target', difficulty: 'medium', category: 'Backtracking', acceptance_rate: 68, leetcodeUrl: 'https://leetcode.com/problems/combination-sum/' },
      { id: '62', title: 'Combination Sum II', description: 'Find combinations from array with duplicates', difficulty: 'medium', category: 'Backtracking', acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/combination-sum-ii/' },
      { id: '63', title: 'Permutations', description: 'Generate all permutations of array', difficulty: 'medium', category: 'Backtracking', acceptance_rate: 78, leetcodeUrl: 'https://leetcode.com/problems/permutations/' },
      { id: '64', title: 'Permutations II', description: 'Generate permutations with duplicates', difficulty: 'medium', category: 'Backtracking', acceptance_rate: 60, leetcodeUrl: 'https://leetcode.com/problems/permutations-ii/' },
      { id: '65', title: 'Rotate Matrix', description: 'Rotate matrix 90 degrees clockwise', difficulty: 'medium', category: 'Array', acceptance_rate: 64, leetcodeUrl: 'https://leetcode.com/problems/rotate-image/' },
      { id: '66', title: 'Set Matrix Zeroes', description: 'Set matrix elements to zero', difficulty: 'medium', category: 'Array', acceptance_rate: 47, leetcodeUrl: 'https://leetcode.com/problems/set-matrix-zeroes/' },
      { id: '67', title: 'Search 2D Matrix', description: 'Search in 2D matrix', difficulty: 'medium', category: 'Array', acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/search-a-2d-matrix/' },
      { id: '68', title: 'Validate BST', description: 'Validate binary search tree', difficulty: 'medium', category: 'Tree', acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/validate-binary-search-tree/' },
      { id: '69', title: 'Recover BST', description: 'Recover binary search tree', difficulty: 'medium', category: 'Tree', acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/recover-binary-search-tree/' },
      { id: '70', title: 'LCA of BST', description: 'Lowest common ancestor of BST', difficulty: 'medium', category: 'Tree', acceptance_rate: 59, leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/' },
      { id: '71', title: 'LCA of Tree', description: 'Lowest common ancestor of binary tree', difficulty: 'medium', category: 'Tree', acceptance_rate: 53, leetcodeUrl: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      { id: '72', title: 'Populating Next Pointer', description: 'Populate next pointers in tree nodes', difficulty: 'medium', category: 'Tree', acceptance_rate: 50, leetcodeUrl: 'https://leetcode.com/problems/populating-next-right-pointers-in-each-node/' },
      { id: '73', title: 'Binary Tree Paths', description: 'Print all root-to-leaf paths', difficulty: 'medium', category: 'Tree', acceptance_rate: 54, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-paths/' },
      { id: '74', title: 'Sum Root to Leaf', description: 'Sum of all root-to-leaf numbers', difficulty: 'medium', category: 'Tree', acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/sum-root-to-leaf-numbers/' },
      { id: '75', title: 'Flatten Binary Tree', description: 'Flatten binary tree to linked list', difficulty: 'medium', category: 'Tree', acceptance_rate: 53, leetcodeUrl: 'https://leetcode.com/problems/flatten-binary-tree-to-linked-list/' },

      // Hard Problems (76-100)
      { id: '76', title: 'Median of Two Arrays', description: 'Find median of two sorted arrays', difficulty: 'hard', category: 'Array', acceptance_rate: 32, leetcodeUrl: 'https://leetcode.com/problems/median-of-two-sorted-arrays/' },
      { id: '77', title: 'Regular Expression Match', description: 'Implement regex pattern matching', difficulty: 'hard', category: 'DP', acceptance_rate: 28, leetcodeUrl: 'https://leetcode.com/problems/regular-expression-matching/' },
      { id: '78', title: 'Wildcard Matching', description: 'Wildcard pattern matching', difficulty: 'hard', category: 'DP', acceptance_rate: 28, leetcodeUrl: 'https://leetcode.com/problems/wildcard-matching/' },
      { id: '79', title: 'N-Queens', description: 'Solve N-Queens problem', difficulty: 'hard', category: 'Backtracking', acceptance_rate: 64, leetcodeUrl: 'https://leetcode.com/problems/n-queens/' },
      { id: '80', title: 'N-Queens II', description: 'Count N-Queens solutions', difficulty: 'hard', category: 'Backtracking', acceptance_rate: 77, leetcodeUrl: 'https://leetcode.com/problems/n-queens-ii/' },
      { id: '81', title: 'Maximal Rectangle', description: 'Find maximal rectangle in matrix', difficulty: 'hard', category: 'DP', acceptance_rate: 39, leetcodeUrl: 'https://leetcode.com/problems/maximal-rectangle/' },
      { id: '82', title: 'Word Ladder', description: 'Find shortest path between words', difficulty: 'hard', category: 'BFS', acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/word-ladder/' },
      { id: '83', title: 'Word Ladder II', description: 'Find all shortest word ladders', difficulty: 'hard', category: 'BFS', acceptance_rate: 29, leetcodeUrl: 'https://leetcode.com/problems/word-ladder-ii/' },
      { id: '84', title: 'Max Points on Line', description: 'Find maximum points on a line', difficulty: 'hard', category: 'Math', acceptance_rate: 26, leetcodeUrl: 'https://leetcode.com/problems/max-points-on-a-line/' },
      { id: '85', title: 'Longest Consecutive', description: 'Find longest consecutive elements', difficulty: 'hard', category: 'Array', acceptance_rate: 48, leetcodeUrl: 'https://leetcode.com/problems/longest-consecutive/' },
      { id: '86', title: 'Alien Dictionary', description: 'Order of alien dictionary', difficulty: 'hard', category: 'Topological Sort', acceptance_rate: 34, leetcodeUrl: 'https://leetcode.com/problems/alien-dictionary/' },
      { id: '87', title: 'Scramble String', description: 'Check if strings are scrambled', difficulty: 'hard', category: 'DP', acceptance_rate: 34, leetcodeUrl: 'https://leetcode.com/problems/scramble-string/' },
      { id: '88', title: 'Merge Sorted Arrays', description: 'Merge k sorted arrays', difficulty: 'hard', category: 'Array', acceptance_rate: 47, leetcodeUrl: 'https://leetcode.com/problems/merge-k-sorted-lists/' },
      { id: '89', title: 'Largest Rectangle', description: 'Largest rectangle in histogram', difficulty: 'hard', category: 'Stack', acceptance_rate: 39, leetcodeUrl: 'https://leetcode.com/problems/largest-rectangle-in-histogram/' },
      { id: '90', title: 'Binary Tree Maximum', description: 'Binary tree maximum path sum', difficulty: 'hard', category: 'Tree', acceptance_rate: 40, leetcodeUrl: 'https://leetcode.com/problems/binary-tree-maximum-path-sum/' },
      { id: '91', title: 'Serialize Deserialize', description: 'Serialize and deserialize BST', difficulty: 'hard', category: 'Tree', acceptance_rate: 52, leetcodeUrl: 'https://leetcode.com/problems/serialize-and-deserialize-binary-tree/' },
      { id: '92', title: 'Word Break', description: 'Word break problem with dictionary', difficulty: 'hard', category: 'DP', acceptance_rate: 42, leetcodeUrl: 'https://leetcode.com/problems/word-break/' },
      { id: '93', title: 'Word Break II', description: 'All word break combinations', difficulty: 'hard', category: 'DP', acceptance_rate: 37, leetcodeUrl: 'https://leetcode.com/problems/word-break-ii/' },
      { id: '94', title: 'LRU Cache', description: 'Implement LRU cache', difficulty: 'hard', category: 'Design', acceptance_rate: 35, leetcodeUrl: 'https://leetcode.com/problems/lru-cache/' },
      { id: '95', title: 'Copy List with Random', description: 'Deep copy linked list with random pointer', difficulty: 'hard', category: 'Linked List', acceptance_rate: 49, leetcodeUrl: 'https://leetcode.com/problems/copy-list-with-random-pointer/' },
      { id: '96', title: 'Minimum Window Substring', description: 'Find minimum window substring', difficulty: 'hard', category: 'String', acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/minimum-window-substring/' },
      { id: '97', title: 'Interleaving String', description: 'Check interleaving of strings', difficulty: 'hard', category: 'DP', acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/interleaving-string/' },
      { id: '98', title: 'Distinct Subsequences', description: 'Count distinct subsequences', difficulty: 'hard', category: 'DP', acceptance_rate: 41, leetcodeUrl: 'https://leetcode.com/problems/distinct-subsequences/' },
      { id: '99', title: 'Edit Distance', description: 'Calculate edit distance between strings', difficulty: 'hard', category: 'DP', acceptance_rate: 49, leetcodeUrl: 'https://leetcode.com/problems/edit-distance/' },
      { id: '100', title: 'Jump Game II', description: 'Minimum jumps to reach end', difficulty: 'hard', category: 'Array', acceptance_rate: 38, leetcodeUrl: 'https://leetcode.com/problems/jump-game-ii/' }
    ];
    return of(challenges).pipe(
      catchError(error => {
        console.error('Error fetching challenges:', error);
        return of([]);
      })
    );
  }

  /**
   * Fetch documentation links for various technologies
   */
  getDocumentation(): Observable<Documentation[]> {
    return of([
      {
        id: '1',
        title: 'MDN Web Docs',
        description: 'Comprehensive documentation for HTML, CSS, JavaScript and Web APIs',
        language: 'Web',
        official_url: 'https://developer.mozilla.org/'
      },
      {
        id: '2',
        title: 'TypeScript Documentation',
        description: 'Official TypeScript language documentation and reference',
        language: 'TypeScript',
        official_url: 'https://www.typescriptlang.org/docs/'
      },
      {
        id: '3',
        title: 'Angular Documentation',
        description: 'Complete guide to Angular framework with API reference',
        language: 'Angular',
        official_url: 'https://angular.io/docs'
      },
      {
        id: '4',
        title: 'React Documentation',
        description: 'Official React documentation with guides and API reference',
        language: 'React',
        official_url: 'https://react.dev/'
      },
      {
        id: '5',
        title: 'Python Official Docs',
        description: 'Complete Python language reference and standard library documentation',
        language: 'Python',
        official_url: 'https://docs.python.org/3/'
      },
      {
        id: '6',
        title: 'Node.js Documentation',
        description: 'Node.js runtime and API documentation',
        language: 'Node.js',
        official_url: 'https://nodejs.org/en/docs/'
      }
    ]).pipe(
      catchError(error => {
        console.error('Error fetching documentation:', error);
        return of([]);
      })
    );
  }

  /**
   * Fetch all learning content at once
   */
  getAllLearningContent() {
    return {
      tutorials$: this.getTutorials(),
      challenges$: this.getChallenges(),
      documentation$: this.getDocumentation()
    };
  }
}
