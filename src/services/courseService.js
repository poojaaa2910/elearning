import { db } from '../firebase/config';
import { collection, getDocs, doc, getDoc, query, orderBy } from 'firebase/firestore';

export const courseService = {
  async getFields() {
    return [
      { id: 'coding', name: 'Coding', icon: '💻', description: 'Learn programming fundamentals' },
      { id: 'management', name: 'Management', icon: '👔', description: 'Master leadership skills' },
      { id: 'philosophy', name: 'Philosophy', icon: '🏛️', description: 'Explore wisdom traditions' }
    ];
  },

  // Get all courses from Firestore
  async getAllCoursesFromFirestore() {
    try {
      const coursesSnapshot = await getDocs(query(collection(db, 'courses'), orderBy('createdAt', 'desc')));
      return coursesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error fetching courses from Firestore:', error);
      return [];
    }
  },

  // Get single course by ID
  async getCourseFromFirestore(courseId) {
    try {
      const courseDoc = await getDoc(doc(db, 'courses', courseId));
      if (courseDoc.exists()) {
        return { id: courseDoc.id, ...courseDoc.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching course from Firestore:', error);
      return null;
    }
  },

  // Get courses by field
  async getCoursesByFieldFromFirestore(field) {
    const courses = await this.getAllCoursesFromFirestore();
    return courses.filter(course => course.field === field);
  },

  // Legacy compatibility methods
  async getCoursesByField(field) {
    return this.getCoursesByFieldFromFirestore(field);
  },

  async getCourseById(courseId) {
    return this.getCourseFromFirestore(courseId);
  },

  async getMilestoneById(courseId, milestoneId) {
    const course = await this.getCourseFromFirestore(courseId);
    if (!course) return null;
    return course.milestones?.find(m => m.id.toString() === milestoneId.toString()) || null;
  },

  async getAllCourses() {
    return this.getAllCoursesFromFirestore();
  }
};