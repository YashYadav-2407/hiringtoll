import { Injectable } from '@angular/core';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  username: string;
  country: string;
  role: string;
  institution: string;
  avatar?: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class LocalDbService {
  private readonly USERS_KEY = 'hiring_tool_users';
  private readonly TOKEN_KEY = 'authToken';

  constructor() {}

  /**
   * Get all users from localStorage
   */
  getAllUsers(): User[] {
    const users = localStorage.getItem(this.USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  /**
   * Find user by email
   */
  findUserByEmail(email: string): User | undefined {
    const users = this.getAllUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase());
  }

  /**
   * Create a new user
   */
  createUser(user: Omit<User, 'id' | 'createdAt'>): User {
    const users = this.getAllUsers();
    
    // Check if user with this email already exists
    if (users.find(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      throw new Error('User with this email already exists');
    }

    const newUser: User = {
      ...user,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
    
    return newUser;
  }

  /**
   * Verify user credentials
   */
  verifyCredentials(email: string, password: string): User | null {
    const user = this.findUserByEmail(email);
    
    if (user && user.password === password) {
      return user;
    }
    
    return null;
  }

  /**
   * Generate a simple ID
   */
  private generateId(): string {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a token
   */
  generateToken(): string {
    return `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}
