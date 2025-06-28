// --- ILLUSTRATION COMPONENTS ---
export const BarChart = ({ high = 5, low = 95, close = 70, color = "currentColor" }) => (
    <svg viewBox="0 0 20 100" width="25" height="100" className="mx-auto">
        <line x1="10" y1={high} x2="10" y2={low} stroke={color} strokeWidth="2.5" />
        <line x1="10" y1={close} x2="18" y2={close} stroke={color} strokeWidth="2.5" />
    </svg>
);

export const VolumeBar = ({ height = 60, color = "currentColor"}) => (
    <div className="flex items-end justify-center h-20">
        <div style={{ height: `${height}%`, backgroundColor: color }} className="w-6 rounded-t-sm"></div>
    </div>
);

// --- DATA STORE ---
export const learningPath = [
    {
        id: 'fundamentals',
        title: 'Nền tảng VSA: Đọc hiểu từng thanh Bar',
        description: 'Trước khi phân tích các mẫu hình phức tạp, hãy nắm vững 3 yếu tố cốt lõi của một thanh giá.',
        concepts: [
            { id: 'spread', title: 'Biên Độ Giá (Spread)', content: 'Phản ánh sức mạnh tương quan giữa hai bên Mua và Bán. Spread rộng cho thấy một bên chiếm ưu thế. Spread hẹp cho thấy sự cân bằng hoặc do dự.', illustration: (<div className="flex justify-around items-center h-full"><div><BarChart high={5} low={95} close={20} color="#34d399" /><p className="text-xs text-center mt-1">Rộng</p></div><div><BarChart high={35} low={65} close={45} color="#f87171" /><p className="text-xs text-center mt-1">Hẹp</p></div></div>) },
            { id: 'close', title: 'Giá Đóng Cửa', content: 'Vị trí đóng cửa cho thấy phe nào thắng thế cuối phiên. Đóng cửa cao = phe mua thắng. Đóng cửa thấp = phe bán thắng.', illustration: (<div className="flex justify-around items-center h-full"><div><BarChart high={10} low={90} close={20} color="#34d399" /><p className="text-xs text-center mt-1">Cao</p></div><div><BarChart high={10} low={90} close={80} color="#f87171" /><p className="text-xs text-center mt-1">Thấp</p></div><div><BarChart high={10} low={90} close={50} color="#9ca3af" /><p className="text-xs text-center mt-1">Giữa</p></div></div>) },
            { id: 'volume', title: 'Khối Lượng (Volume)', content: 'Là thước đo năng lượng. Volume lớn xác nhận sức mạnh. Volume thấp cho thấy sự cạn kiệt hoặc thiếu quan tâm.', illustration: (<div className="flex justify-around items-end h-full pt-5"><div><VolumeBar height={20} color="#9ca3af" /><p className="text-xs text-center mt-1">Thấp</p></div><div><VolumeBar height={50} color="#60a5fa" /><p className="text-xs text-center mt-1">Trung bình</p></div><div><VolumeBar height={90} color="#f87171" /><p className="text-xs text-center mt-1">Cao</p></div></div>) },
            { id: 'context', title: 'Bối Cảnh: Vùng Cung - Cầu', content: 'Vùng Cầu (hỗ trợ) là nơi lực mua tiềm năng xuất hiện. Vùng Cung (kháng cự) là nơi lực bán tiềm năng xuất hiện.', illustration: (<div className="h-full w-full flex flex-col justify-center px-2"><div className="w-full bg-red-500/10 border-t-2 border-b-2 border-dashed border-red-400 py-1 mb-10"><p className="text-xs text-center text-red-300 font-semibold">Vùng Cung</p></div><div className="w-full h-1 bg-gray-700"></div><div className="w-full bg-emerald-500/10 border-t-2 border-b-2 border-dashed border-emerald-400 py-1 mt-10"><p className="text-xs text-center text-emerald-300 font-semibold">Vùng Cầu</p></div></div>) },
        ]
    },
];

export const absorptionPairsByZone = [
    {
        zone: 'Tại Vùng Cung (Kháng cự)',
        description: 'So sánh các tín hiệu đối lập khi giá tiếp cận vùng có áp lực bán mạnh.',
        pairs: [
            {
                supply: { title: 'Upbar hấp thụ cung', analysis: { spread: 'Rộng/Trung bình.', volume: 'Lớn.', close: 'Đóng cửa gần Cao.'}, result: 'Tiềm năng TĂNG, vượt đỉnh.' },
                demand: { title: 'Upbar hấp thụ cầu', analysis: { spread: 'Hẹp.', volume: 'Lớn.', close: 'Đóng cửa gần Thấp.'}, result: 'Tiềm năng GIẢM, tạo đỉnh.' }
            },
            {
                supply: { title: 'Breakout dứt khoát', analysis: { spread: 'Rộng.', volume: 'Cực Lớn.', close: 'Vượt vùng cung, đóng cửa cao.'}, result: 'Xác nhận sức mạnh, TĂNG tiếp diễn.' },
                demand: { title: 'Buying Climax (Cao trào mua)', analysis: { spread: 'Rộng nhưng không giữ được giá.', volume: 'Cực Lớn.', close: 'Đóng cửa nửa dưới thân bar.'}, result: 'Bẫy tăng giá, khả năng GIẢM mạnh.' }
            },
            {
                supply: { title: 'No Supply gần vùng cung', analysis: { spread: 'Hẹp.', volume: 'Thấp.', close: 'Đóng cửa giữa/thấp (downbar).'}, result: 'Tạm nghỉ để TĂNG tiếp.' },
                demand: { title: 'No Demand tại vùng cung', analysis: { spread: 'Hẹp.', volume: 'Thấp.', close: 'Đóng cửa giữa (upbar).'}, result: 'Cầu cạn kiệt, tiềm năng GIẢM.' }
            },
            {
                supply: { title: 'Shakeout dưới vùng cung', analysis: { spread: 'Rộng.', volume: 'Lớn.', close: 'Hồi phục đóng cửa cao.'}, result: 'Loại bỏ phe yếu, chuẩn bị TĂNG.' },
                demand: { title: 'Upthrust', analysis: { spread: 'Rộng.', volume: 'Lớn.', close: 'Bị bán ngược, đóng cửa thấp.'}, result: 'Tín hiệu bán rất mạnh, GIẢM.' }
            },
        ]
    },
    {
        zone: 'Tại Vùng Cầu (Hỗ trợ)',
        description: 'So sánh các tín hiệu đối lập khi giá tiếp cận vùng có lực mua tiềm năng.',
        pairs: [
            {
                supply: { title: 'Downbar hấp thụ cung', analysis: { spread: 'Hẹp.', volume: 'Lớn.', close: 'Đóng cửa gần Cao.'}, result: 'Lực bán bị hấp thụ, tiềm năng TĂNG.' },
                demand: { title: 'Downbar tiếp diễn', analysis: { spread: 'Rộng/Trung bình.', volume: 'Lớn.', close: 'Đóng cửa gần Thấp.'}, result: 'Hỗ trợ yếu, tiềm năng GIẢM tiếp.' }
            },
            {
                supply: { title: 'Selling Climax (Cao trào bán)', analysis: { spread: 'Rộng.', volume: 'Cực Lớn.', close: 'Phục hồi, đóng cửa ở nửa trên.'}, result: 'Tạo đáy, khả năng TĂNG mạnh.' },
                demand: { title: 'Breakdown dứt khoát', analysis: { spread: 'Rộng.', volume: 'Cực Lớn.', close: 'Vượt vùng cầu, đóng cửa thấp.'}, result: 'Xác nhận xu hướng GIẢM.' }
            },
            {
                supply: { title: 'No Supply tại vùng cầu', analysis: { spread: 'Hẹp.', volume: 'Thấp.', close: 'Đóng cửa giữa/thấp (downbar).'}, result: 'Tín hiệu mua sớm, chờ TĂNG.' },
                demand: { title: 'No Demand tại vùng cầu', analysis: { spread: 'Hẹp.', volume: 'Thấp.', close: 'Đóng cửa giữa (upbar).'}, result: 'Cầu yếu, có thể GIẢM tiếp.' }
            },
            {
                supply: { title: 'Shakeout', analysis: { spread: 'Rộng.', volume: 'Lớn.', close: 'Hồi phục đóng cửa cao.'}, result: 'Tín hiệu mua rất mạnh, TĂNG.' },
                demand: { title: 'Hồi phục yếu ớt bị bán', analysis: { spread: 'Upbar yếu bị theo sau bởi Downbar mạnh.', volume: 'Tăng ở Downbar.', close: 'Downbar đóng cửa thấp.'}, result: 'Bán chủ động, phe mua yếu, GIẢM.'}
            },
             {
                supply: { title: 'Stopping Volume', analysis: { spread: 'Có thể rộng hoặc hẹp.', volume: 'Cực lớn (cao đột biến).', close: 'Được đẩy lên khỏi mức đáy.'}, result: 'Tạm dừng giảm, chờ xác nhận TĂNG.' },
                demand: null
            },
        ]
    }
];

export const specialPatterns = [
    {
        title: 'Shortening of the Thrust (Nỗ lực rút ngắn)',
        meaning: 'Là một chuỗi các thanh bar cùng hướng (tăng hoặc giảm) nhưng có biên độ (spread) ngày càng thu hẹp, cho thấy xu hướng đang mất đà và sắp đảo chiều.',
        characteristics: [
            'Thường xuất hiện ở cuối một xu hướng tăng hoặc giảm.',
            'Các thanh Up-bar (trong xu hướng tăng) ngày càng ngắn lại dù volume có thể vẫn cao.',
            'Các thanh Down-bar (trong xu hướng giảm) có đáy không thấp hơn nhiều so với thanh trước.',
            'Đây là dấu hiệu suy yếu, không phải là tín hiệu hành động ngay lập tức.'
        ]
    },
    {
        title: 'Mẫu hình "Bánh mì kẹp thịt" (Sandwich)',
        meaning: 'Thể hiện một nỗ lực đảo chiều (tăng hoặc giảm) đã bị phe đối ứng hấp thụ hoàn toàn, cho thấy xu hướng ban đầu có khả năng tiếp tục.',
        characteristics: [
            'Là một chuỗi ít nhất 3 thanh bar liên tiếp.',
            'Thanh 1: Xác lập kỳ vọng ban đầu, thường có đuôi dài và đóng cửa gần cực trị.',
            'Thanh 2 (Giữa): Nỗ lực đảo chiều bị từ chối, có biên độ lớn hơn và đóng cửa ngược hướng thanh 1.',
            'Thanh 3: Xác nhận sự thất bại của nỗ lực đảo chiều, đóng cửa ủng hộ hướng của thanh 1.'
        ]
    },
    {
        title: 'Lằn ranh trên cát (Line in the Sand)',
        meaning: 'Cho thấy một bên đã hoàn toàn chiếm ưu thế trong phiên đó. Nếu các thanh bar sau phủ định lại thanh này, đó là một dấu hiệu hấp thụ rất mạnh.',
        characteristics: [
            'Là một thanh bar duy nhất có biên độ rất rộng.',
            'Giá đóng cửa nằm chính xác tại đỉnh hoặc đáy của thanh giá.',
            'Lằn ranh được vẽ tại râu trên (nếu đóng cửa cao nhất) hoặc râu dưới (nếu đóng cửa thấp nhất).',
            'Đây là "lằn ranh tâm lý" giữa phe mua và phe bán.'
        ]
    }
];

// New, detailed database for the interactive lookup tool
export const vsaPatternsDatabase = [
    // Tại Vùng Cầu
    { title: 'Downbar hấp thụ cung', interpretation: 'Lực bán mạnh đã bị phe mua hấp thụ hoàn toàn. Tín hiệu đảo chiều tăng giá mạnh.', tags: { zone: 'demand', bar_type: 'down', spread: 'narrow', close_pos: 'high', volume: 'high' } },
    { title: 'Stopping Volume', interpretation: 'Dòng tiền lớn đã can thiệp để chặn đà giảm. Chờ tín hiệu xác nhận (ví dụ No Supply) để mua.', tags: { zone: 'demand', bar_type: 'down', spread: 'any', close_pos: 'mid_high', volume: 'very_high' } },
    { title: 'Selling Climax', interpretation: 'Sự hoảng loạn của đám đông và hành động mua vào của Smart Money. Tín hiệu tạo đáy tiềm năng rất cao.', tags: { zone: 'demand', bar_type: 'down', spread: 'wide', close_pos: 'mid_high', volume: 'very_high' } },
    { title: 'No Supply', interpretation: 'Áp lực bán đã cạn kiệt. Thị trường sẵn sàng cho một đợt tăng giá. Tín hiệu mua sớm.', tags: { zone: 'demand', bar_type: 'down', spread: 'narrow', close_pos: 'mid_low', volume: 'very_low' } },
    { title: 'Shakeout', interpretation: 'Smart Money đã rũ bỏ thành công người bán yếu. Tín hiệu mua rất mạnh.', tags: { zone: 'demand', bar_type: 'any', spread: 'wide', close_pos: 'high', volume: 'high' } },
    { title: 'Downbar tiếp diễn', interpretation: 'Lực bán vẫn đang chiếm ưu thế, lực mua tại vùng hỗ trợ là yếu. Khả năng cao giá sẽ giảm tiếp.', tags: { zone: 'demand', bar_type: 'down', spread: 'medium_wide', close_pos: 'low', volume: 'high' } },
    { title: 'Breakdown dứt khoát', interpretation: 'Vùng hỗ trợ đã bị phá vỡ với lực bán áp đảo. Xác nhận xu hướng giảm.', tags: { zone: 'demand', bar_type: 'down', spread: 'wide', close_pos: 'very_low', volume: 'very_high' } },
    { title: 'No Demand tại vùng cầu', interpretation: 'Nỗ lực phục hồi thất bại vì không có lực mua. Cảnh báo giá có thể giảm sâu hơn.', tags: { zone: 'demand', bar_type: 'up', spread: 'narrow', close_pos: 'mid', volume: 'low' } },
    
    // Tại Vùng Cung
    { title: 'Upbar hấp thụ cung', interpretation: 'Lực mua mạnh mẽ, đang hấp thụ hết lực bán tại kháng cự. Tín hiệu tốt cho khả năng vượt đỉnh.', tags: { zone: 'supply', bar_type: 'up', spread: 'medium_wide', close_pos: 'high', volume: 'high' } },
    { title: 'Breakout dứt khoát', interpretation: 'Vùng kháng cự bị phá vỡ với lực mua áp đảo. Xác nhận xu hướng tăng.', tags: { zone: 'supply', bar_type: 'up', spread: 'wide', close_pos: 'very_high', volume: 'very_high' } },
    { title: 'Upbar hấp thụ cầu (phân phối)', interpretation: 'Nỗ lực mua đã bị phe bán hấp thụ. Tín hiệu đảo chiều giảm giá mạnh.', tags: { zone: 'supply', bar_type: 'up', spread: 'narrow', close_pos: 'low', volume: 'high' } },
    { title: 'Buying Climax', interpretation: 'Bẫy tăng giá kinh điển. Smart Money bán ra mạnh mẽ sau khi dụ được người mua. Khả năng giảm mạnh.', tags: { zone: 'supply', bar_type: 'up', spread: 'wide', close_pos: 'mid_low', volume: 'very_high' } },
    { title: 'No Demand tại vùng cung', interpretation: 'Lực mua đã cạn kiệt, không ai muốn mua ở giá cao. Thị trường sẵn sàng cho một đợt giảm giá.', tags: { zone: 'supply', bar_type: 'up', spread: 'narrow', close_pos: 'mid', volume: 'low' } },
    { title: 'Upthrust', interpretation: 'Smart Money đã tạo bẫy tăng giá thành công để bán ra. Tín hiệu bán rất mạnh.', tags: { zone: 'supply', bar_type: 'any', spread: 'wide', close_pos: 'low', volume: 'high' } },
];

export const tradingPlan = {
    title: 'Kế Hoạch Giao Dịch Toàn Diện',
    description: 'Một hệ thống VSA hoàn chỉnh không chỉ là phân tích mà còn là hành động có kế hoạch. Luôn tuân thủ các bước sau:',
    steps: [
        { title: 'Bước 1: Phân Tích Tổng Thể (Top-down)', content: 'Phân tích thị trường chung (VN-Index) và liên thị trường (nếu cần) để xác định xu hướng chính. Giao dịch thuận theo xu hướng lớn sẽ có xác suất thành công cao hơn.' },
        { title: 'Bước 2: Lựa Chọn Cổ Phiếu', content: 'Xác định các ngành đang dẫn dắt thị trường (sóng ngành). Sau đó, sử dụng phân tích sức mạnh tương đối (RS) để tìm ra cổ phiếu mạnh nhất trong ngành đó.' },
        { title: 'Bước 3: Phân Tích VSA Chi Tiết', content: 'Trên biểu đồ của cổ phiếu đã chọn, xác định các vùng Cung/Cầu quan trọng. Chờ đợi và tìm kiếm các tín hiệu VSA then chốt xuất hiện tại các vùng này.' },
        { title: 'Bước 4: Thực Thi Giao Dịch', content: 'Xác định điểm vào lệnh (Entry) sau khi có thanh bar xác nhận tín hiệu. Luôn đặt điểm dừng lỗ (Stoploss) một cách logic (ví dụ: dưới đáy Shakeout, trên đỉnh Upthrust) và xác định mục tiêu chốt lời (Take Profit) tại các vùng cản tiếp theo.' },
        { title: 'Bước 5: Quản Trị & Ghi Chép', content: 'Theo dõi chặt chẽ vị thế và sẵn sàng điều chỉnh khi có tín hiệu mới. Luôn ghi lại nhật ký giao dịch để phân tích, rút kinh nghiệm và cải thiện hệ thống.' }
    ]
};

export const traderMindset = {
    title: 'Tâm Thức Giao Dịch',
    description: 'Thành công không chỉ đến từ phương pháp, mà còn từ một tâm lý vững vàng. Đây là những đức tính cần rèn luyện:',
    points: [
        { title: 'Kiên Nhẫn', content: 'Chờ đợi cơ hội rõ ràng nhất, đúng với kế hoạch của bạn. Không vào lệnh sớm, không giao dịch vì sốt ruột.' },
        { title: 'Kỷ Luật', content: 'Tuân thủ tuyệt đối hệ thống và kế hoạch đã đặt ra, từ điểm vào, dừng lỗ đến chốt lời. Không để cảm xúc chi phối quyết định.' },
        { title: 'Dũng Cảm', content: 'Dám chấp nhận rủi ro và thực hiện giao dịch khi tín hiệu xuất hiện. Quan trọng hơn, dám cắt lỗ một cách dứt khoát khi đã sai.' },
        { title: 'Khiêm Tốn', content: 'Luôn nhận thức rằng bạn có thể sai và thị trường luôn đúng. Không bao giờ chủ quan, luôn chuẩn bị cho kịch bản xấu nhất.' },
    ]
};

export const quizQuestions = [
    { question: "Khi giá giảm về vùng Cầu với khối lượng thấp và biên độ hẹp, đó là tín hiệu gì?", options: ["Shakeout", "No Supply", "Stopping Volume", "Upthrust"], correct: 1, explanation: "No Supply là một Down-bar có biên độ hẹp và khối lượng thấp, cho thấy áp lực bán đã cạn kiệt tại vùng Cầu, một tín hiệu tốt cho phe mua." },
    { question: "Tại vùng Cung, bạn thấy một Up-bar có spread rộng, volume rất cao nhưng giá đóng cửa ở nửa dưới. Đây là tín hiệu của...?", options: ["Sức mạnh breakout.", "Buying Climax (Cao trào mua).", "Test cung thành công.", "No Demand."], correct: 1, explanation: "Đây là ví dụ kinh điển của nguyên tắc Nỗ Lực vs. Kết Quả. Nỗ lực tăng giá rất lớn (spread rộng, volume cao) nhưng kết quả lại thất bại (đóng cửa thấp), cho thấy phe bán đã hấp thụ hết lực mua." },
    { question: "Mẫu hình Shakeout có đặc điểm quan trọng nhất là gì?", options: ["Volume thấp và spread hẹp.", "Đóng cửa ở mức thấp nhất.", "Phá vỡ một mức hỗ trợ rồi phục hồi và đóng cửa cao.", "Xuất hiện ở vùng cung."], correct: 2, explanation: "Bản chất của Shakeout là một cú 'rũ bỏ' - giá phá vỡ hỗ trợ để loại bỏ người bán yếu, sau đó Smart Money nhanh chóng mua vào và đẩy giá phục hồi mạnh mẽ." },
    { question: "Một Up-bar có spread hẹp và volume thấp tại Vùng Cung được gọi là gì?", options: ["No Supply", "Stopping Volume", "Upthrust", "No Demand"], correct: 3, explanation: "Đây là tín hiệu No Demand, cho thấy sự cạn kiệt của lực mua. Không còn ai hứng thú mua ở mức giá cao, báo hiệu khả năng giảm giá." }
]; 