import { 
  doc, setDoc, getDoc, updateDoc, deleteDoc, 
  collection, getDocs, query, orderBy, where, limit 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../firebase/config';

export const adminService = {
  // ==================== COURSES ====================
  
  async getAllCourses() {
    try {
      const coursesRef = collection(db, 'courses');
      const q = query(coursesRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const courses = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Add quiz count from course document
      return courses.map(course => ({
        ...course,
        quizCount: course.quiz?.length || 0
      }));
    } catch (error) {
      console.error('Error fetching courses:', error);
      return [];
    }
  },

  async getCourseById(courseId) {
    try {
      const docRef = doc(db, 'courses', courseId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching course:', error);
      return null;
    }
  },

  async createCourse(courseData) {
    const courseRef = doc(collection(db, 'courses'));
    const cleanData = Object.fromEntries(
      Object.entries(courseData).filter(([_, v]) => v !== undefined)
    );
    await setDoc(courseRef, {
      ...cleanData,
      milestones: [],
      quiz: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return courseRef.id;
  },

  async createCourseWithId(customId, courseData) {
    const courseRef = doc(db, 'courses', customId);
    const cleanData = Object.fromEntries(
      Object.entries(courseData).filter(([_, v]) => v !== undefined)
    );
    await setDoc(courseRef, {
      ...cleanData,
      milestones: [],
      quiz: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return customId;
  },

  async updateCourse(courseId, courseData) {
    const courseRef = doc(db, 'courses', courseId);
    const docSnap = await getDoc(courseRef);
    const cleanData = Object.fromEntries(
      Object.entries({
        ...courseData,
        updatedAt: new Date().toISOString()
      }).filter(([_, v]) => v !== undefined)
    );
    
    if (docSnap.exists()) {
      await updateDoc(courseRef, cleanData);
    } else {
      await setDoc(courseRef, {
        ...cleanData,
        createdAt: cleanData.updatedAt
      });
    }
  },

  async deleteCourse(courseId) {
    // Get course to check for files
    const course = await this.getCourseById(courseId);
    
    // Delete associated files in Storage
    if (course?.pdfUrl) {
      try {
        await deleteObject(ref(storage, course.pdfUrl));
      } catch (e) { /* ignore */ }
    }
    
    // Delete the course document
    await deleteDoc(doc(db, 'courses', courseId));
  },

  // ==================== MILESTONES ====================

  async addMilestone(courseId, milestoneData) {
    const courseRef = doc(db, 'courses', courseId);
    const course = await this.getCourseById(courseId);
    
    const milestones = course?.milestones || [];
    milestones.push({
      id: Date.now().toString(),
      ...Object.fromEntries(
        Object.entries(milestoneData).filter(([_, v]) => v !== undefined)
      ),
      order: milestones.length + 1
    });
    
    await updateDoc(courseRef, {
      milestones,
      updatedAt: new Date().toISOString()
    });
  },

  async updateMilestone(courseId, milestoneId, milestoneData) {
    const courseRef = doc(db, 'courses', courseId);
    const course = await this.getCourseById(courseId);
    
    const milestones = course?.milestones || [];
    const index = milestones.findIndex(m => m.id === milestoneId);
    if (index !== -1) {
      milestones[index] = { 
        ...milestones[index], 
        ...Object.fromEntries(
          Object.entries(milestoneData).filter(([_, v]) => v !== undefined)
        )
      };
    }
    
    await updateDoc(courseRef, {
      milestones,
      updatedAt: new Date().toISOString()
    });
  },

  async deleteMilestone(courseId, milestoneId) {
    const courseRef = doc(db, 'courses', courseId);
    const course = await this.getCourseById(courseId);
    
    const milestones = (course?.milestones || []).filter(m => m.id !== milestoneId);
    
    await updateDoc(courseRef, {
      milestones,
      updatedAt: new Date().toISOString()
    });
  },

  // ==================== QUIZZES ====================

  async getQuiz(courseId) {
    const quizzesRef = collection(db, 'quizzes');
    const q = query(quizzesRef, where('courseId', '==', courseId));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  },

  async saveQuiz(courseId, questions) {
    console.log('Saving quiz for course:', courseId, 'with questions:', questions);
    const existingQuiz = await this.getQuiz(courseId);
    console.log('Existing quiz:', existingQuiz);
    
    if (existingQuiz) {
      await updateDoc(doc(db, 'quizzes', existingQuiz.id), {
        questions,
        updatedAt: new Date().toISOString()
      });
    } else {
      const quizRef = doc(collection(db, 'quizzes'));
      await setDoc(quizRef, {
        courseId,
        questions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    console.log('Quiz saved!');
  },

  // ==================== FILE UPLOADS ====================

  async uploadFile(courseId, file, type) {
    const validTypes = ['pdf', 'vtt'];
    if (!validTypes.includes(type)) {
      throw new Error('Invalid file type');
    }

    const fileName = type === 'pdf' ? 'course-notes.pdf' : 'captions.vtt';
    const storageRef = ref(storage, `courses/${courseId}/files/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    // Update course with file URL
    const updateData = type === 'pdf' 
      ? { pdfUrl: downloadURL }
      : { vttUrl: downloadURL };
    
    await this.updateCourse(courseId, updateData);
    
    return downloadURL;
  },

  async deleteFile(courseId, type) {
    const validTypes = ['pdf', 'vtt'];
    if (!validTypes.includes(type)) {
      throw new Error('Invalid file type');
    }
    
    const fileName = type === 'pdf' ? 'course-notes.pdf' : 'captions.vtt';
    const storageRef = ref(storage, `courses/${courseId}/files/${fileName}`);
    
    try {
      await deleteObject(storageRef);
    } catch (e) {
      // File might not exist
    }
    
    const updateData = type === 'pdf' 
      ? { pdfUrl: null }
      : { vttUrl: null };
    
    await this.updateCourse(courseId, updateData);
  },

  // ==================== STATS ====================

  async getStats() {
    try {
      // Total courses
      const coursesSnapshot = await getDocs(collection(db, 'courses'));
      const totalCourses = coursesSnapshot.size;

      // Total users
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const totalUsers = usersSnapshot.size;

      // Total admins
      const adminsQuery = query(collection(db, 'users'), where('role', '==', 'admin'));
      const adminsSnapshot = await getDocs(adminsQuery);
      const totalAdmins = adminsSnapshot.size;

      // Total quizzes
      const quizzesSnapshot = await getDocs(collection(db, 'quizzes'));
      const totalQuizzes = quizzesSnapshot.size;

      return {
        totalCourses,
        totalUsers,
        totalAdmins,
        totalQuizzes
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        totalCourses: 0,
        totalUsers: 0,
        totalAdmins: 0,
        totalQuizzes: 0
      };
    }
  },

  // ==================== USERS ====================

  async getAllUsers() {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  },

  async updateUserRole(userId, role) {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, { role });
  }
};
