import { Card } from '@embed-tools/components';
import Pillar from './Pillar';
import InfoButton from './InfoButton';
import { EXPLANATIONS } from '../data/explanations';

const PillarSection = ({ pillars, onOpenModal }) => {
  if (!pillars) return null;

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Lá Số Bát Tự (Tứ Trụ)</h2>
        <InfoButton onClick={() => onOpenModal('Giải Thích: Lá Số Bát Tự', EXPLANATIONS.LA_SO_BAT_TU)} />
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <Pillar 
          stem={pillars.year.stem} 
          branch={pillars.year.branch} 
          label="Trụ Năm" 
        />
        <Pillar 
          stem={pillars.month.stem} 
          branch={pillars.month.branch} 
          label="Trụ Tháng" 
        />
        <Pillar 
          stem={pillars.day.stem} 
          branch={pillars.day.branch} 
          label="Trụ Ngày" 
        />
        <Pillar 
          stem={pillars.time?.stem} 
          branch={pillars.time?.branch} 
          label="Trụ Giờ" 
        />
      </div>
    </Card>
  );
};

export default PillarSection; 