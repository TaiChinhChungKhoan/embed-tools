import { Card } from '@embed-tools/components';
import { EXPLANATIONS } from '../data/explanations';

const ReferenceSection = () => (
  <div className="max-w-3xl mx-auto p-6 space-y-8">
    <h1 className="text-2xl font-bold mb-4">Tra cứu Kiến Thức Bát Tự</h1>
    <Card className="mb-6 p-6">
      <h2 className="text-xl font-semibold mb-2">Ngũ Hành – Quan Hệ Sinh Khắc</h2>
      <div className="prose max-w-none prose-table:td:px-4 prose-table:th:px-4" dangerouslySetInnerHTML={{ __html: EXPLANATIONS.NGU_HANH }} />
    </Card>
    <Card className="mb-6 p-6">
      <h2 className="text-xl font-semibold mb-2">Danh Sách 10 Thiên Can</h2>
      <div className="prose max-w-none prose-table:td:px-4 prose-table:th:px-4" dangerouslySetInnerHTML={{ __html: EXPLANATIONS.THIEN_CAN }} />
    </Card>
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-2">Danh Sách 12 Địa Chi</h2>
      <div className="prose max-w-none prose-table:td:px-4 prose-table:th:px-4" dangerouslySetInnerHTML={{ __html: EXPLANATIONS.DIA_CHI }} />
    </Card>
    <Card className="mb-6 p-6">
      <h2 className="text-xl font-semibold mb-2">Giai Đoạn Thuận Tài</h2>
      <div className="prose max-w-none prose-table:td:px-4 prose-table:th:px-4" dangerouslySetInnerHTML={{ __html: EXPLANATIONS.GIAI_DOAN_THUAN_TAI }} />
    </Card>
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-2">Giai Đoạn Thuận Sức Khỏe & Học Vấn</h2>
      <div className="prose max-w-none prose-table:td:px-4 prose-table:th:px-4" dangerouslySetInnerHTML={{ __html: EXPLANATIONS.GIAI_DOAN_THUAN_SUC_KHOE }} />
    </Card>
  </div>
);

export default ReferenceSection; 