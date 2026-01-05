import type {
    User,
    Job,
    Candidate,
    Application,
    Interview,
    AuthResponse,
    StorageData
} from '../types';

const STORAGE_KEY = 'hiregenie_data';

// Initialize storage with sample data
const initializeStorage = (): StorageData => {
    const sampleData: StorageData = {
        users: [],
        jobs: [
            {
                id: '1',
                title: 'Senior Frontend Developer',
                company: 'Tech Corp',
                location: 'San Francisco, CA',
                type: 'full-time',
                experience: '5+ years',
                salary: '$120k - $160k',
                description: 'We are looking for an experienced Frontend Developer to join our team.',
                requirements: [
                    '5+ years of React experience',
                    'Strong TypeScript skills',
                    'Experience with modern build tools',
                    'Excellent communication skills'
                ],
                skills: ['React', 'TypeScript', 'CSS', 'JavaScript', 'Git'],
                status: 'active',
                recruiterId: 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: '2',
                title: 'Full Stack Engineer',
                company: 'StartupXYZ',
                location: 'Remote',
                type: 'full-time',
                experience: '3-5 years',
                salary: '$100k - $140k',
                description: 'Join our fast-growing startup as a Full Stack Engineer.',
                requirements: [
                    'Experience with Node.js and React',
                    'Database design skills',
                    'API development experience',
                    'Startup mindset'
                ],
                skills: ['Node.js', 'React', 'PostgreSQL', 'AWS', 'Docker'],
                status: 'active',
                recruiterId: 'system',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ],
        candidates: [],
        applications: [],
        interviews: [],
        currentUser: null
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleData));
    return sampleData;
};

// Get data from localStorage
const getData = (): StorageData => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        return initializeStorage();
    }
    return JSON.parse(data);
};

// Save data to localStorage
const saveData = (data: StorageData): void => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// Generate unique ID
const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// ============= AUTH SERVICES =============

export const authService = {
    register: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): AuthResponse => {
        const data = getData();

        console.log('Registration attempt for:', userData.email);
        console.log('Current users count:', data.users.length);

        // Check if user already exists
        const existingUser = data.users.find(u => u.email === userData.email);
        if (existingUser) {
            console.error('User already exists:', userData.email);
            return { success: false, message: 'User with this email already exists' };
        }

        // Create new user
        const newUser: User = {
            ...userData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        console.log('Creating new user:', newUser);
        data.users.push(newUser);
        data.currentUser = newUser;
        saveData(data);
        console.log('User registered successfully. Total users:', data.users.length);

        return {
            success: true,
            user: newUser,
            token: `token_${newUser.id}`,
            message: 'Registration successful'
        };
    },

    login: (email: string, password: string): AuthResponse => {
        const data = getData();

        console.log('Login attempt - Total users in storage:', data.users.length);
        console.log('Looking for user with email:', email);
        console.log('All registered emails:', data.users.map(u => u.email));
        console.log('Attempting login with password:', password);

        // Check if email exists first
        const userByEmail = data.users.find(u => u.email === email);
        if (userByEmail) {
            console.log('User found with email:', userByEmail.email);
            console.log('Stored password:', userByEmail.password);
            console.log('Entered password:', password);
            console.log('Passwords match:', userByEmail.password === password);
            console.log('User type:', userByEmail.userType);
        } else {
            console.error('No user found with email:', email);
        }

        const user = data.users.find(u => u.email === email && u.password === password);
        if (!user) {
            console.error('User not found or password mismatch');
            console.log('Checking email match:', data.users.find(u => u.email === email) ? 'Email exists' : 'Email not found');
            return { success: false, message: 'Invalid email or password' };
        }

        console.log('User found, logging in:', user.email);
        data.currentUser = user;
        saveData(data);

        return {
            success: true,
            user,
            token: `token_${user.id}`,
            message: 'Login successful'
        };
    },

    logout: (): void => {
        const data = getData();
        data.currentUser = null;
        saveData(data);
    },

    getCurrentUser: (): User | null => {
        const data = getData();
        return data.currentUser;
    },

    updateUser: (userId: string, updates: Partial<User>): AuthResponse => {
        const data = getData();

        console.log('Updating user:', userId, updates);

        // Find and update user in users array
        const userIndex = data.users.findIndex(u => u.id === userId);
        if (userIndex === -1) {
            console.error('User not found for update');
            return { success: false, message: 'User not found' };
        }

        // Update user
        data.users[userIndex] = {
            ...data.users[userIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        // If this is the current user, update currentUser as well
        if (data.currentUser && data.currentUser.id === userId) {
            data.currentUser = data.users[userIndex];
        }

        saveData(data);
        console.log('User updated successfully');

        return {
            success: true,
            user: data.users[userIndex],
            message: 'Profile updated successfully'
        };
    },

    isAuthenticated: (): boolean => {
        return getData().currentUser !== null;
    }
};

// ============= JOB SERVICES =============

export const jobService = {
    getAll: (): Job[] => {
        return getData().jobs;
    },

    getById: (id: string): Job | undefined => {
        return getData().jobs.find(job => job.id === id);
    },

    getByRecruiter: (recruiterId: string): Job[] => {
        return getData().jobs.filter(job => job.recruiterId === recruiterId);
    },

    create: (jobData: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job => {
        const data = getData();
        const newJob: Job = {
            ...jobData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.jobs.push(newJob);
        saveData(data);
        return newJob;
    },

    update: (id: string, updates: Partial<Job>): Job | null => {
        const data = getData();
        const index = data.jobs.findIndex(job => job.id === id);

        if (index === -1) return null;

        data.jobs[index] = {
            ...data.jobs[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        saveData(data);
        return data.jobs[index];
    },

    delete: (id: string): boolean => {
        const data = getData();
        const index = data.jobs.findIndex(job => job.id === id);

        if (index === -1) return false;

        data.jobs.splice(index, 1);
        saveData(data);
        return true;
    }
};

// ============= CANDIDATE SERVICES =============

export const candidateService = {
    getAll: (): Candidate[] => {
        return getData().candidates;
    },

    getById: (id: string): Candidate | undefined => {
        return getData().candidates.find(candidate => candidate.id === id);
    },

    create: (candidateData: Omit<Candidate, 'id' | 'createdAt' | 'updatedAt'>): Candidate => {
        const data = getData();
        const newCandidate: Candidate = {
            ...candidateData,
            id: generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        data.candidates.push(newCandidate);
        saveData(data);
        return newCandidate;
    },

    update: (id: string, updates: Partial<Candidate>): Candidate | null => {
        const data = getData();
        const index = data.candidates.findIndex(c => c.id === id);

        if (index === -1) return null;

        data.candidates[index] = {
            ...data.candidates[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        saveData(data);
        return data.candidates[index];
    },

    delete: (id: string): boolean => {
        const data = getData();
        const index = data.candidates.findIndex(c => c.id === id);

        if (index === -1) return false;

        data.candidates.splice(index, 1);
        saveData(data);
        return true;
    }
};

// ============= APPLICATION SERVICES =============

export const applicationService = {
    getAll: (): Application[] => {
        return getData().applications;
    },

    getById: (id: string): Application | undefined => {
        return getData().applications.find(app => app.id === id);
    },

    getByCandidate: (candidateId: string): Application[] => {
        return getData().applications.filter(app => app.candidateId === candidateId);
    },

    getByJob: (jobId: string): Application[] => {
        return getData().applications.filter(app => app.jobId === jobId);
    },

    create: (applicationData: Omit<Application, 'id' | 'appliedAt'>): Application => {
        const data = getData();
        const newApplication: Application = {
            ...applicationData,
            id: generateId(),
            appliedAt: new Date().toISOString()
        };

        data.applications.push(newApplication);
        saveData(data);

        // Get job and applicant details for notification
        const job = data.jobs.find(j => j.id === applicationData.jobId);
        const applicant = data.users.find(u => u.id === applicationData.candidateId);

        // Create notification for the recruiter
        if (job && applicant) {
            console.log('Creating notification for recruiter:', job.recruiterId);
            console.log('Applicant:', applicant.firstName, applicant.lastName);
            console.log('Job:', job.title);

            // In a real app, this would send an email or push notification
            // For now, we'll just log it
            console.log(`📧 NOTIFICATION: ${applicant.firstName} ${applicant.lastName} applied to ${job.title}`);
        }

        return newApplication;
    },

    updateStatus: (id: string, status: Application['status']): Application | null => {
        const data = getData();
        const index = data.applications.findIndex(app => app.id === id);

        if (index === -1) return null;

        data.applications[index].status = status;
        saveData(data);
        return data.applications[index];
    }
};

// ============= INTERVIEW SERVICES =============

export const interviewService = {
    getAll: (): Interview[] => {
        return getData().interviews;
    },

    getById: (id: string): Interview | undefined => {
        return getData().interviews.find(interview => interview.id === id);
    },

    getByCandidate: (candidateId: string): Interview[] => {
        return getData().interviews.filter(interview => interview.candidateId === candidateId);
    },

    getByJob: (jobId: string): Interview[] => {
        return getData().interviews.filter(interview => interview.jobId === jobId);
    },

    create: (interviewData: Omit<Interview, 'id' | 'createdAt'>): Interview => {
        const data = getData();
        const newInterview: Interview = {
            ...interviewData,
            id: generateId(),
            createdAt: new Date().toISOString()
        };

        data.interviews.push(newInterview);
        saveData(data);
        return newInterview;
    },

    update: (id: string, updates: Partial<Interview>): Interview | null => {
        const data = getData();
        const index = data.interviews.findIndex(i => i.id === id);

        if (index === -1) return null;

        data.interviews[index] = {
            ...data.interviews[index],
            ...updates
        };

        saveData(data);
        return data.interviews[index];
    },

    delete: (id: string): boolean => {
        const data = getData();
        const index = data.interviews.findIndex(i => i.id === id);

        if (index === -1) return false;

        data.interviews.splice(index, 1);
        saveData(data);
        return true;
    }
};

// ============= UTILITY SERVICES =============

export const storageService = {
    clearAll: (): void => {
        localStorage.removeItem(STORAGE_KEY);
        initializeStorage();
    },

    exportData: (): string => {
        return JSON.stringify(getData(), null, 2);
    },

    importData: (jsonData: string): boolean => {
        try {
            const data = JSON.parse(jsonData);
            saveData(data);
            return true;
        } catch {
            return false;
        }
    }
};
