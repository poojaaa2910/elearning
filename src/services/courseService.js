import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';
import { coursesData } from '../data/courses';

const USE_FIRESTORE = true; // Set to false to use static data only

export const courseService = {
  async getFields() {
    return [
      { id: 'coding', name: 'Coding', icon: '💻', description: 'Learn programming fundamentals' },
      { id: 'management', name: 'Management', icon: '👔', description: 'Master leadership skills' },
      { id: 'philosophy', name: 'Philosophy', icon: '🏛️', description: 'Explore wisdom traditions' }
    ];
  },

  getCoursesByField(field) {
    return coursesData.filter(course => course.field === field);
  },

  getCourseById(courseId) {
    return coursesData.find(course => course.id === courseId) || null;
  },

  getMilestoneById(courseId, milestoneId) {
    const course = this.getCourseById(courseId);
    if (!course) return null;
    return course.milestones.find(m => m.id === milestoneId) || null;
  },

  getAllCourses() {
    return coursesData;
  },

  // ==================== FIRESTORE METHODS ====================

  async getCourseFromFirestore(courseId) {
    if (!USE_FIRESTORE) {
      return this.getCourseById(courseId);
    }
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        return { id: courseDoc.id, ...courseDoc.data() };
      }
      // Fallback to static data
      return this.getCourseById(courseId);
    } catch (error) {
      console.error('Error fetching course from Firestore:', error);
      return this.getCourseById(courseId);
    }
  },

  async getAllCoursesFromFirestore() {
    if (!USE_FIRESTORE) {
      return coursesData;
    }
    try {
      const coursesSnapshot = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
      const firestoreCourses = coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Merge static with Firestore (Firestore overrides static with same ID)
      const staticMap = new Map(coursesData.map(c => [c.id, c]));
      firestoreCourses.forEach(c => staticMap.set(c.id, c));
      
      return Array.from(staticMap.values());
    } catch (error) {
      console.error('Error fetching courses from Firestore:', error);
      return coursesData;
    }
  },

  async getCoursesByFieldFromFirestore(field) {
    const courses = await this.getAllCoursesFromFirestore();
    return courses.filter(course => course.field === field);
  }
};
