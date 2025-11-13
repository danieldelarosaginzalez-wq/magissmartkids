import Layout from '../components/Layout';
import TeacherGradeManagement from '../components/coordinator/TeacherGradeManagement';

export default function TeacherGradeManagementPage() {
  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TeacherGradeManagement />
      </div>
    </Layout>
  );
}
