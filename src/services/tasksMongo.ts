import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = 'mongodb://localhost:27017';
const DB_NAME = 'AltiusV3';
const COLLECTION_NAME = 'tareas';

let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) {
    return cachedClient;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  cachedClient = client;
  return client;
}

export interface TaskDocument {
  _id?: ObjectId;
  title: string;
  description: string;
  taskType: 'multimedia' | 'interactive';
  subject: string;
  subjectId: string;
  teacherId: string;
  studentId: string;
  priority: 'Alta' | 'Media' | 'Baja';
  dueDate: Date;
  hasSubmission: boolean;
  score?: number;
  feedback?: string;
  allowedFormats?: string[];
  maxFiles?: number;
  maxSizeMb?: number;
  activityConfig?: {
    type: string;
    maxScore: number;
    questions?: any[];
  };
  createdAt: Date;
  updatedAt: Date;
}

export async function createTask(task: Omit<TaskDocument, '_id'>) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  const result = await collection.insertOne({
    ...task,
    createdAt: new Date(),
    updatedAt: new Date()
  });
  return result;
}

export async function getTasksByStudent(studentId: string) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  return collection.find({ studentId }).toArray();
}

export async function getTasksByTeacher(teacherId: string) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  return collection.find({ teacherId }).toArray();
}

export async function updateTask(taskId: string, update: Partial<TaskDocument>) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  const result = await collection.updateOne(
    { _id: new ObjectId(taskId) },
    { 
      $set: {
        ...update,
        updatedAt: new Date()
      }
    }
  );
  return result;
}

export async function deleteTask(taskId: string) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  const result = await collection.deleteOne({ _id: new ObjectId(taskId) });
  return result;
}

export async function getTaskById(taskId: string) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  return collection.findOne({ _id: new ObjectId(taskId) });
}

export async function getPendingTasksByTeacher(teacherId: string) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  return collection.find({
    teacherId,
    hasSubmission: true,
    score: { $exists: false }
  }).toArray();
}

export async function getTeacherStats(teacherId: string) {
  const client = await connectToDatabase();
  const collection = client.db(DB_NAME).collection<TaskDocument>(COLLECTION_NAME);
  
  const [pendingGrading, averageScore] = await Promise.all([
    collection.countDocuments({
      teacherId,
      hasSubmission: true,
      score: { $exists: false }
    }),
    collection.aggregate([
      {
        $match: {
          teacherId,
          score: { $exists: true }
        }
      },
      {
        $group: {
          _id: null,
          average: { $avg: '$score' }
        }
      }
    ]).toArray()
  ]);

  return {
    pendingGrading,
    averageScore: averageScore[0]?.average || 0
  };
}