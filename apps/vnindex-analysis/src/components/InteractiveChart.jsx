import React, { useEffect, useRef } from 'react';
import Card from './Card';

// External wicode data script
const wicode = [
    {
        "keyWord": "Tăng trưởng kinh tế",
        "name": "gdp",
        "className": "wi-g_d_p",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "GDP bình quân",
        "name": "gdpbinhquan",
        "className": "wi-g_d_p_binh_quan",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Thu nhập bình quân",
        "name": "gdpbinhquan",
        "className": "wi-g_d_p_binh_quan",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "GDP",
        "name": "gdp",
        "className": "wi-g_d_p",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Chỉ số giá tiêu dùng",
        "name": "cpi",
        "className": "wi-c_p_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "CPI",
        "name": "cpi",
        "className": "wi-c_p_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lạm phát",
        "name": "cpi",
        "className": "wi-c_p_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tổng mức bán lẻ hàng hóa và dịch vụ",
        "name": "hhdv",
        "className": "wi-h_h_d_v",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Doanh thu bán lẻ hàng hóa và dịch vụ",
        "name": "hhdv",
        "className": "wi-h_h_d_v",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Bán lẻ hàng hóa và dịch vụ",
        "name": "hhdv",
        "className": "wi-h_h_d_v",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Vốn đầu tư phát triển xã hội",
        "name": "vdtptxh",
        "className": "wi-v_d_t_ptxh",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Vốn đầu tư từ NSNN",
        "name": "vdtnsnn",
        "className": "wi-v_d_t_nsnn",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Vốn đầu tư từ ngân sách nhà nước",
        "name": "vdtnsnn",
        "className": "wi-v_d_t_nsnn",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Vốn đầu tư công",
        "name": "vdtnsnn",
        "className": "wi-v_d_t_nsnn",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Chỉ số sản xuất công nghiệp",
        "name": "iip",
        "className": "wi-i_i_p",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "IIP",
        "name": "iip",
        "className": "wi-i_i_p",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "PMI",
        "name": "pmi",
        "className": "wi-p_m_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Purchasing Managers Index",
        "name": "pmi",
        "className": "wi-p_m_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Chỉ số quản lý thu mua",
        "name": "pmi",
        "className": "wi-p_m_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "FDI",
        "name": "fdi",
        "className": "wi-f_d_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Vốn đầu tư trực tiếp nước ngoài",
        "name": "fdi",
        "className": "wi-f_d_i",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Cán cân thương mại",
        "name": "cctm",
        "className": "wi-c_c_t_m",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Nhập khẩu",
        "name": "cctm",
        "className": "wi-c_c_t_m",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Xuất khẩu",
        "name": "cctm",
        "className": "wi-c_c_t_m",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Vận chuyển hàng hóa",
        "name": "vt",
        "className": "wi-v_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Vận chuyển hành khách",
        "name": "vt",
        "className": "wi-v_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Khách quốc tế",
        "name": "kqt",
        "className": "wi-k_q_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "M2",
        "name": "ctt",
        "className": "wi-c_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Cung tiền tệ",
        "name": "ctt",
        "className": "wi-c_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tổng huy động vốn trong nền kinh tế",
        "name": "hd",
        "className": "wi-h_d",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tổng tiền gửi trong nền kinh tế",
        "name": "hd",
        "className": "wi-h_d",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tổng tín dụng trong nền kinh tế",
        "name": "td",
        "className": "wi-t_d",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tín phiếu kho bạc",
        "name": "tpkb",
        "className": "wi-t_p_k_b",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "SBV - Bills",
        "name": "tpkb",
        "className": "wi-t_p_k_b",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Treasury bills",
        "name": "tpkb",
        "className": "wi-t_p_k_b",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Bills",
        "name": "tpkb",
        "className": "wi-t_p_k_b",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "OMO",
        "name": "nvttm",
        "className": "wi-n_v_t_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Nghiệp vụ thị trường mở",
        "name": "nvttm",
        "className": "wi-n_v_t_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Open Market Operations",
        "name": "nvttm",
        "className": "wi-n_v_t_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lãi suất liên ngân hàng",
        "name": "lslnh",
        "className": "wi-l_s_l_n_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lãi suất chiết khấu",
        "name": "lsdh",
        "className": "wi-l_s_d_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lãi suất tái cấp vốn",
        "name": "lsdh",
        "className": "wi-l_s_d_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "LS qua đêm cho vay bù đắp thiếu hụt vốn",
        "name": "lsdh",
        "className": "wi-l_s_d_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lãi suất điều hành",
        "name": "lsdh",
        "className": "wi-l_s_d_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lãi suất chính sách",
        "name": "lsdh",
        "className": "wi-l_s_d_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lãi suất huy động",
        "name": "lshd",
        "className": "wi-l_s_h_d",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tỷ giá trung tâm",
        "name": "dhtg",
        "className": "wi-d_h_t_g",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tỷ giá trần",
        "name": "dhtg",
        "className": "wi-d_h_t_g",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Tỷ giá sàn",
        "name": "dhtg",
        "className": "wi-d_h_t_g",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Điều hành tỷ giá",
        "name": "dhtg",
        "className": "wi-d_h_t_g",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Dự trữ ngoại hối nhà nước",
        "name": "dtnh",
        "className": "wi-d_t_n_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Dự trữ ngoại hối",
        "name": "dtnh",
        "className": "wi-d_t_n_h",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Cán cân thanh toán",
        "name": "cctt",
        "className": "wi-c_c_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "BOP",
        "name": "cctt",
        "className": "wi-c_c_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Balance of Payment",
        "name": "cctt",
        "className": "wi-c_c_t_t",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Thu ngân sách",
        "name": "tcns",
        "className": "wi-t_c_n_s",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Bội chi ngân sách",
        "name": "tcns",
        "className": "wi-t_c_n_s",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Chi ngân sách",
        "name": "tcns",
        "className": "wi-t_c_n_s",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Ngân sách nhà nước",
        "name": "tcns",
        "className": "wi-t_c_n_s",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Nợ chính phủ",
        "name": "ncp",
        "className": "wi-n_c_p",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Nợ công",
        "name": "ncp",
        "className": "wi-n_c_p",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Nợ quốc gia",
        "name": "ncp",
        "className": "wi-n_c_p",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Dân số",
        "name": "ds",
        "className": "wi-d_s",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lực lượng lao động",
        "name": "ld",
        "className": "wi-l_d",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Lao động",
        "name": "ld",
        "className": "wi-l_d",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Thất nghiệp",
        "name": "tn",
        "className": "wi-t_n",
        "type": "vi_mo_tien_te"
    },
    {
        "keyWord": "Xi măng Trung Quốc",
        "name": "xi_mang",
        "className": "wi-x_m",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Xi măng",
        "name": "xi_mang_pcb",
        "className": "wi-xi_mang_pcb",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá vàng",
        "name": "vang",
        "className": "wi-vang",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá điện",
        "name": "dien",
        "className": "wi-dien",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Heo hơi",
        "name": "heo_hoi",
        "className": "wi-heo_hoi",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Xăng dầu",
        "name": "xang_dau",
        "className": "wi-xang_dau",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Cà phê",
        "name": "ca_phe",
        "className": "wi-ca_phe",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Cá tra",
        "name": "ca_tra",
        "className": "wi-ca_tra",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá tiêu",
        "name": "tieu",
        "className": "wi-tieu",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá thép",
        "name": "thep",
        "className": "wi-thep",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Phân Ure",
        "name": "phan_ure",
        "className": "wi-phan_ure",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Phốt pho",
        "name": "phot_pho",
        "className": "wi-phot_pho",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Lưu huỳnh",
        "name": "luu_huynh",
        "className": "wi-luu_huynh",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá niken",
        "name": "niken",
        "className": "wi-niken",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng Việt Nam",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng Trung Quốc",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng thế giới",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng tăng",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng giảm",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng vượt",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng đạt",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng cao",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng thấp",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng trên",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đồng biến động",
        "name": "dong",
        "className": "wi-dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá nhôm",
        "name": "nhom",
        "className": "wi-nhom",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá kẽm",
        "name": "kem",
        "className": "wi-kem",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá thiếc",
        "name": "thiec",
        "className": "wi-thiec",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá chì",
        "name": "chi",
        "className": "wi-chi",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Than cốc",
        "name": "than_coc",
        "className": "wi-than_coc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Quặng sắt",
        "name": "quang_sat",
        "className": "wi-quang_sat",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Sợi coton",
        "name": "soi_coton",
        "className": "wi-soi_coton",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Vải coton",
        "name": "vai_coton",
        "className": "wi-vai_coton",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Bột giấy",
        "name": "bot_giay",
        "className": "wi-bot_giay",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Lợn hơi Trung Quốc",
        "name": "lon_hoi_trung_quoc",
        "className": "wi-lon_hoi_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Dầu cọ",
        "name": "dau_co_malaysia",
        "className": "wi-dau_co_malaysia",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giấy gợn sóng",
        "name": "giay_gon_song_trung_quoc",
        "className": "wi-giay_gon_song_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Đậu nành Mỹ",
        "name": "dau_nanh_my",
        "className": "wi-dau_nanh_my",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Nhựa đường",
        "name": "nhua_duong_60_70",
        "className": "wi-nhua_duong_60_70",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá đường",
        "name": "duong",
        "className": "wi-duong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Vải cotton Mỹ",
        "name": "vai_cotton_my",
        "className": "wi-vai_cotton_my",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Gạo TPXK",
        "name": "gao_tpxk",
        "className": "wi-gao_tpxk",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Tôm sú",
        "name": "tom_su",
        "className": "wi-tom_su",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Tôm thẻ",
        "name": "tom_the",
        "className": "wi-tom_the",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Phụ phẩm lúa gạo",
        "name": "phu_pham_lua_gao",
        "className": "wi-phu_pham_lua_gao",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Lúa",
        "name": "lua",
        "className": "wi-lua",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Gạo nguyên liệu",
        "name": "gao_nguyen_lieu",
        "className": "wi-gao_nguyen_lieu",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Giá bạc",
        "name": "bac",
        "className": "wi-bac",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Ure Trung Đông",
        "name": "ure_trung_dong",
        "className": "wi-ure_trung_dong",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Xút Trung Quốc",
        "name": "xut_naoh_trung_quoc",
        "className": "wi-xut_naoh_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Phân DAP Trung Quốc",
        "name": "phan_dap_trung_quoc",
        "className": "wi-phan_dap_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Phân Urea Trung Quốc",
        "name": "phan_urea_trung_quoc",
        "className": "wi-phan_urea_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Thép dây Trung Quốc",
        "name": "thep_day_trung_quoc",
        "className": "wi-thep_day_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Thép thanh Trung Quốc",
        "name": "thep_thanh_trung_quoc",
        "className": "wi-thep_thanh_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Thép phế Anh",
        "name": "thep_phe_anh",
        "className": "wi-thep_phe_anh",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Thép thanh Anh",
        "name": "thep_thanh_anh",
        "className": "wi-thep_thanh_anh",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "HRC Trung Quốc",
        "name": "hrc_trung_quoc",
        "className": "wi-hrc_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Đá 0-4",
        "name": "da_0_4",
        "className": "wi-da_0_4",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Đá mi sàng",
        "name": "da_mi_sang",
        "className": "wi-da_mi_sang",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Đá 1x2",
        "name": "da_1x2",
        "className": "wi-da_1x2",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Đá Hộc",
        "name": "da_hoc",
        "className": "wi-da_hoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Tôn lạnh màu",
        "name": "ton_lanh_mau_hoa_sen_045mm",
        "className": "wi-ton_lanh_mau_hoa_sen_045mm",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Tôn lạnh",
        "name": "ton_lanh_hoa_sen_045mm",
        "className": "wi-ton_lanh_hoa_sen_045mm",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Bê tông nhựa mịn",
        "name": "be_tong_nhua_min",
        "className": "wi-be_tong_nhua_min",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Ống nhựa 27 x 1.8mm",
        "name": "ong_nhua_27x18mm",
        "className": "wi-ong_nhua_27x18mm",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Ống nhựa 60 x 2mm",
        "name": "ong_nhua_60x2mm",
        "className": "wi-ong_nhua_60x2mm",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Ống nhựa 90 x 2,9mm",
        "name": "ong_nhua_90x29mm",
        "className": "wi-ong_nhua_90x29mm",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Sơn lót kháng kiềm",
        "name": "son_lot_khang_kiem_cao_cap",
        "className": "wi-son_lot_khang_kiem_cao_cap",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Sơn nội thất",
        "name": "son_noi_that_tieu_chuan",
        "className": "wi-son_noi_that_tieu_chuan",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Sơn ngoại thất",
        "name": "son_ngoai_that_tieu_chuan",
        "className": "wi-son_ngoai_that_tieu_chuan",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Kính màu trắng cường lực",
        "name": "kinh_mau_trang",
        "className": "wi-kinh_mau_trang",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Kính Solar control cường lực",
        "name": "kinh_solar",
        "className": "wi-kinh_solar",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Dây cáp điện",
        "name": "day_cap_dien",
        "className": "wi-day_cap_dien",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Gạch đất sét nung",
        "name": "gach_dat_set_nung",
        "className": "wi-gach_dat_set_nung",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Cọc bê tông",
        "name": "coc_be_tong_du_ung_luc",
        "className": "wi-coc_be_tong_du_ung_luc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Bê tông",
        "name": "be_tong_mac_300",
        "className": "wi-be_tong_mac_300",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Khí LPG Trung Quốc",
        "name": "khi_lpg_trung_quoc",
        "className": "wi-khi_lpg_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Dầu WTI",
        "name": "dau_wti",
        "className": "wi-dau_wti",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Khí thiên nhiên",
        "name": "khi_thien_nhien",
        "className": "wi-khi_thien_nhien",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Than Newcastle",
        "name": "than_newcastle",
        "className": "wi-than_newcastle",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Mazút",
        "name": "mazut",
        "className": "wi-mazut",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Cao su thế giới",
        "name": "cao_su_nhat_ban",
        "className": "wi-cao_su_nhat_ban",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Cao su",
        "name": "cao_su",
        "className": "wi-cao_su",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Hạt PET",
        "name": "pet_trung_quoc",
        "className": "wi-pet_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Hạt nhựa PVC Trung Quốc",
        "name": "nhua_pvc_trung_quoc",
        "className": "wi-nhua_pvc_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "Hạt nhựa PP Trung Quốc",
        "name": "nhua_pp_trung_quoc",
        "className": "wi-nhua_pp_trung_quoc",
        "type": "vi_mo_hang_hoa"
    },
    {
        "keyWord": "CK Nhật Bản - Nikkei 225",
        "name": "ni255",
        "className": "178",
        "type": "investing"
    },
    {
        "keyWord": "CK Trung Quốc - Shanghai Composite (SSEC)",
        "name": "shanghai",
        "className": "40820",
        "type": "investing"
    },
    {
        "keyWord": "CK Mỹ - S&P 500",
        "name": "dow_jone_sp500",
        "className": "166",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số Dow Jones Industrial Average (DJI)",
        "name": "dow_jone",
        "className": "169",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số NASDAQ Composite (IXIC)",
        "name": "nasdaq-composite",
        "className": "14958",
        "type": "investing"
    },
    {
        "keyWord": "FTSE 100",
        "name": "ftse100",
        "className": "27",
        "type": "investing"
    },
    {
        "keyWord": "Hang Seng Index - CK Hồng Kông",
        "name": "hangseng_hsi",
        "className": "179",
        "type": "investing"
    },
    {
        "keyWord": "CK Việt Nam - VNINDEX",
        "name": "vnindex",
        "className": "41063",
        "type": "investing"
    },
    {
        "keyWord": "Dollar Index - DXY",
        "name": "dxy",
        "className": "942611",
        "type": "investing"
    },
    {
        "keyWord": "Lãi suất TPCP Mỹ - 10 năm (%)",
        "name": "us_bond_10y_investing",
        "className": "23705",
        "type": "investing"
    },
    {
        "keyWord": "Lãi suất TPCP Mỹ - 1 năm (%) ",
        "name": "us_bond_1y_investing",
        "className": "23700",
        "type": "investing"
    },
    {
        "keyWord": "Lãi suất TPCP Việt Nam - 10 năm (%)",
        "name": "vietnam_bond_10y_investing",
        "className": "29379",
        "type": "investing"
    },
    {
        "keyWord": "Lãi suất TPCP Việt Nam - 1 năm (%)",
        "name": "vietnam_bond_1y",
        "className": "29380",
        "type": "investing"
    },
    {
        "keyWord": "Bảng cân đối kế toán của Fed (Bil USD)",
        "name": "fed-ballance-sheet",
        "className": "2145.json",
        "type": "investing"
    },
    {
        "keyWord": "Lãi suất quỹ liên bang của Fed (%)",
        "name": "fed-funds-rate",
        "className": "168.json",
        "type": "investing"
    },
    {
        "keyWord": "Fed Funds Composite Interest Rate (%)",
        "name": "fed-funds-composite-interest-rate",
        "className": "985525",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số CPI Mỹ (%YoY)",
        "name": "usa_cpi",
        "className": "733.json",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số CPI Mỹ (%MoM)",
        "name": "usa_cpi_mom",
        "className": "69.json",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số CPI lõi Mỹ (%YoY)",
        "name": "usa_cpi_core",
        "className": "736.json",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số PCE Lõi Mỹ (%YoY)",
        "name": "usa_pce_core",
        "className": "905.json",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số PCE Lõi Mỹ (%MoM)",
        "name": "usa_pce_month",
        "className": "61.json",
        "type": "investing"
    },
    {
        "keyWord": "Tỷ lệ thất nghiệp Mỹ (%)",
        "name": "unemployment_rate_cpi",
        "className": "300.json",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số Thị Trường Nhà ở của NAHB - Mỹ",
        "name": "nahb-housing-market-index",
        "className": "218.json",
        "type": "investing"
    },
    {
        "keyWord": "S&P/Case-Shiller House Price Index (%YoY)",
        "name": "case-shiller-house-price-index-yoy",
        "className": "329.json",
        "type": "investing"
    },
    {
        "keyWord": "S&P/Case-Shiller House Price Index (%MoM)",
        "name": "case-shiller-house-price-index-mom",
        "className": "913.json",
        "type": "investing"
    },
    {
        "keyWord": "30 Year US mortgage rate (%)",
        "name": "mba-30-year-mortgage-rate",
        "className": "1042.json",
        "type": "investing"
    },
    {
        "keyWord": "USA Retail Inventories Excluding Auto (%)",
        "name": "retail-inventories-ex-auto-1887",
        "className": "1887.json",
        "type": "investing"
    },
    {
        "keyWord": "Eurozone Interest Rate (%)",
        "name": "eurozone-interest-rate-decision",
        "className": "164.json",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số CPI - Trung Quốc (%YoY)",
        "name": "chinese-cpi",
        "className": "459.json",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số IIP - Trung Quốc (%YoY)",
        "name": "chinese-industrial-production",
        "className": "462.json",
        "type": "investing"
    },
    {
        "keyWord": "Lãi suất cho vay cơ bản - Trung Quốc (%)",
        "name": "pboc-loan-prime-rate",
        "className": "1967.json",
        "type": "investing"
    },
    {
        "keyWord": "Bitcoin US Dollar - BTCUSD",
        "name": "btcusd",
        "className": "945629",
        "type": "investing"
    },
    {
        "keyWord": "CBOE Volatility Index (VIX)",
        "name": "volatility-sp500-vix-cboe",
        "className": "44336",
        "type": "investing"
    },
    {
        "keyWord": "US Dollar Vietnamese Dong - USDVND",
        "name": "usdvnd",
        "className": "2214",
        "type": "investing"
    },
    {
        "keyWord": "US Dollar Japanese Yen - USDJPY",
        "name": "usdjpy",
        "className": "3",
        "type": "investing"
    },
    {
        "keyWord": "US Dollar British Pound - USDGPB",
        "name": "usdgbp",
        "className": "2126",
        "type": "investing"
    },
    {
        "keyWord": "US Dollar Swiss Franc - USDCHF",
        "name": "usdchf",
        "className": "4",
        "type": "investing"
    },
    {
        "keyWord": "US Dollar Canadian Dollar - USDCAD",
        "name": "usdcad",
        "className": "7",
        "type": "investing"
    },
    {
        "keyWord": "Astradian Dollar US Dollar - AUDUSD",
        "name": "audusd",
        "className": "5",
        "type": "investing"
    },
    {
        "keyWord": "New Zealand Dollar US Dollar - NZDUSD",
        "name": "nzdusd",
        "className": "5",
        "type": "investing"
    },
    {
        "keyWord": "US Dollar Chinese Yuan - USDCNY",
        "name": "usdcny",
        "className": "2111",
        "type": "investing"
    },
    {
        "keyWord": "Giá dầu Crude Oil WTI Futures (USD)",
        "name": "crude-oil",
        "className": "8849",
        "type": "investing"
    },
    {
        "keyWord": "Giá dầu Brent Oil Futures (USD)",
        "name": "LCOc1",
        "className": "8833",
        "type": "investing"
    },
    {
        "keyWord": "Cao su - Tocom (CNY)",
        "name": "JRUc1",
        "className": "1013463",
        "type": "investing"
    },
    {
        "keyWord": "Cao su RSS3",
        "name": "SRUc1",
        "className": "1013411",
        "type": "investing"
    },
    {
        "keyWord": "Cao su TSR20",
        "name": "STFc1",
        "className": "1013412",
        "type": "investing"
    },
    {
        "keyWord": "Giá vàng - Gold Futures",
        "name": "gold_future",
        "className": "8830",
        "type": "investing"
    },
    {
        "keyWord": "Giá khí thiên nhiên - Natural Gas Futures",
        "name": "natural_gas",
        "className": "8862",
        "type": "investing"
    },
    {
        "keyWord": "Giá thép thanh - Steel Rebar Futures",
        "name": "steel_rebar",
        "className": "996702",
        "type": "investing"
    },
    {
        "keyWord": "Giá đường mỹ - US Sugar #11 Futures",
        "name": "SBc1",
        "className": "8869",
        "type": "investing"
    },
    {
        "keyWord": "Giá Sợi - US Cotton #2 Futures",
        "name": "CTc1",
        "className": "8851",
        "type": "investing"
    },
    {
        "keyWord": "Hợp đồng Tương lai nhựa Polyvinyl Clorua - DPVc1 (CNY)",
        "name": "Polyvinyl_Clorua_DPVc1",
        "className": "961746",
        "type": "investing"
    },
    {
        "keyWord": "Hợp đồng Tương lai nhựa Polyêtylen - DLLc1 (CNY)",
        "name": "nhua_lldpe",
        "className": "961744",
        "type": "investing"
    },
    {
        "keyWord": "Chỉ số vận tải Baltic Dry Index",
        "name": "baltic_dry",
        "className": "940793",
        "type": "investing"
    },
    {
        "keyWord": "Giá Baltic Clean Tanker (USD)",
        "name": "baltic-clean-tanker",
        "className": "940799",
        "type": "investing"
    }
];

const InteractiveChart = () => {
    const chartRef = useRef(null);
    const containerRef = useRef(null);

    useEffect(() => {
        // Load Highcharts if not already loaded
        if (typeof Highcharts === 'undefined') {
            const script = document.createElement('script');
            script.src = 'https://code.highcharts.com/11.1/highcharts.js';
            script.onload = initializeChart;
            document.head.appendChild(script);
        } else {
            initializeChart();
        }

        return () => {
            // Cleanup if needed
            if (chartRef.current) {
                chartRef.current.destroy();
            }
        };
    }, []);

    const initializeChart = () => {
        if (!containerRef.current) return;

        const container = containerRef.current;

        // Create the chart HTML structure
        container.innerHTML = `
            <div class="flex flex-col md:flex-row gap-4">
                <!-- Sidebar Filters -->
                <div class="w-full md:w-[300px] bg-white shadow p-4 md:h-auto">
                    <!-- Tabs -->
                    <div class="flex mb-4 space-x-2" id="tabs">
                        <div class="tab-g transition-all duration-200 cursor-pointer flex-1 text-center py-2 px-3 border border-btn-primary-border rounded-md text-sm font-medium text-white bg-btn-primary"
                        data-tab="vi_mo_tien_te">Vĩ mô</div>
                        <div class="tab-g transition-all duration-200 cursor-pointer flex-1 text-center py-2 px-3 border border-filter rounded-md text-sm font-medium text-menu-link bg-white hover:bg-filter"
                        data-tab="vi_mo_hang_hoa">Hàng hóa</div>
                        <div class="tab-g transition-all duration-200 cursor-pointer flex-1 text-center py-2 px-3 border border-filter rounded-md text-sm font-medium text-menu-link bg-white hover:bg-filter"
                        data-tab="investing">Investing</div>
                    </div>

                    <!-- Search -->
                    <div class="flex items-center mb-3">
                        <svg class="w-5 h-5 mr-2 text-menu-link" fill="currentColor" viewBox="0 0 24 24">
                        <path
                            d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z">
                        </path>
                        </svg>
                        <input autocomplete="off" id="searchInput" placeholder="Tìm kiếm bộ lọc"
                        class="w-full border border-filter rounded-md px-2 py-1 text-sm text-text-color focus:outline-none focus:ring-2 focus:ring-blue" />
                    </div>

                    <!-- Filter List -->
                    <ul id="filterList" class="overflow-y-auto h-[400px] list-none p-0 m-0"></ul>
                </div>

                <!-- Chart Area -->
                <div class="flex-1">
                    <div id="myChart" class="bg-white shadow p-4 min-h-[400px]"></div>
                </div>
            </div>
        `;

        // Initialize chart functionality
        setupChartFunctionality();
    };

    const setupChartFunctionality = () => {
        const tabs = document.querySelectorAll('.tab-g');
        const filterListEl = document.getElementById('filterList');
        const searchInput = document.getElementById('searchInput');
        const chartContainer = document.getElementById('myChart');

        let currentTab = 'vi_mo_tien_te';

        function debounce(fn, delay) {
            let timeout;
            return (...args) => {
                clearTimeout(timeout);
                timeout = setTimeout(() => fn.apply(null, args), delay);
            };
        }

        function adjustChartPeriod(chart) {
            if (!chart.xAxis) return;

            const initialMin = chart.xAxis[0].min;
            const seriesData = chart.series[0].data;
            if (!seriesData.length) return;

            const lastPoint = seriesData[seriesData.length - 1];
            const now = new Date();
            const twoYearsAgo = new Date(now.getFullYear() - 2, now.getMonth(), now.getDate());
            const fromTime = twoYearsAgo.getTime() < initialMin ? initialMin : twoYearsAgo.getTime();

            chart.xAxis[0].setExtremes(fromTime, lastPoint.x);
        }

        function addRecessionPlotBands(chart) {
            if (!chart.xAxis) return;
            const bands = [
                { from: Date.UTC(1970, 1, 1), to: Date.UTC(1970, 12, 1) },
                { from: Date.UTC(1973, 12, 1), to: Date.UTC(1975, 4, 1) },
                { from: Date.UTC(1980, 2, 1), to: Date.UTC(1980, 8, 1) },
                { from: Date.UTC(1981, 8, 1), to: Date.UTC(1982, 12, 1) },
                { from: Date.UTC(1990, 8, 1), to: Date.UTC(1991, 4, 1) },
                { from: Date.UTC(2001, 4, 1), to: Date.UTC(2001, 12, 1) },
                { from: Date.UTC(2008, 1, 1), to: Date.UTC(2009, 7, 1) },
                { from: Date.UTC(2020, 3, 1), to: Date.UTC(2020, 5, 1) },
            ];

            bands.forEach((band, i) => {
                chart.xAxis[0].addPlotBand({
                    id: `r${i}`,
                    color: '#F1F1F1',
                    from: band.from,
                    to: band.to,
                });
            });
        }

        function buildChartConfig(widata, index) {
            let y1 = {
                title: { text: widata.chart.series[0].unit },
                labels: { style: { color: Highcharts.getOptions().colors[0] } },
            };
            let y2 = {
                title: { text: '' },
                labels: { style: { color: Highcharts.getOptions().colors[0] } },
                opposite: true,
            };

            let typeChart = widata.chart.series[0].type;
            let numY = 0;
            const arrayFinal = [];

            widata.chart.series.forEach(s => {
                if (typeChart !== s.type) {
                    numY = 1;
                    y2.title.text = s.unit;
                }
                arrayFinal.push({
                    name: s.name,
                    data: s.data.sort(),
                    fillMissingValues: { type: 'previous' },
                    unit: s.unit,
                    connectNulls: true,
                    type: s.type === 'bar' ? 'column' : 'spline',
                    yAxis: typeChart === s.type ? 0 : 1,
                });
            });

            let summaries = `<b>${widata.timeUpdate}</b> <br/>`;
            if (arrayFinal.length > 2) {
                arrayFinal.forEach(s => {
                    let b = s.data.map(e => e[1]);
                    summaries += `${s.name} : ${b[b.length - 1] || b[b.length - 2] || b[b.length - 3]} (${s.unit})<br/>`;
                });
            } else {
                for (let i = 0; i < widata.titleIndex.length; i++) {
                    summaries += `${widata.titleIndex[i]} (${widata.unitArray[i]})<br/>`;
                }
            }

            return {
                chart: {
                    zoomType: 'x',
                    type: 'column',
                    height: '500px',
                    style: { fontSize: '14px' },
                    resetZoomButton: {
                        position: { x: 0, y: -40 },
                        theme: {
                            fill: 'white',
                            style: { fontSize: '14px' },
                            stroke: 'silver',
                            r: 0,
                            states: { hover: { fill: '#41739D', style: { color: 'white' } } },
                        },
                    },
                },
                xAxis: {
                    crosshair: true,
                    type: 'datetime',
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%e/%m/%Y', this.value);
                        },
                    },
                },
                time: { useUTC: false, timezone: 'Asia/Ho_Chi_Minh' },
                title: { text: widata.title, align: 'center' },
                subtitle: { text: summaries, align: 'left' },
                yAxis: numY ? [y1, y2] : [y1],
                tooltip: {
                    headerFormat: '<b>{point.x:%d/%m/%Y}</b><br>',
                    pointFormat: '{series.name}: {point.y:.2f}<br>',
                    shared: true,
                    useHTML: true,
                },
                credits: { enabled: false },
                exporting: { enabled: true },
                series: arrayFinal,
                plotOptions: {
                    column: { stacking: widata.stacked_column },
                    line: { dataLabels: { enabled: false } },
                },
            };
        }

        function renderChart(widata, index) {
            const config = buildChartConfig(widata, index);
            document.title = widata.title;
            Highcharts.chart('myChart', config, chart => {
                addRecessionPlotBands(chart);
                adjustChartPeriod(chart);
            });
        }

        function renderInvestingChart(data, idx, isJsonEvent) {
            if (!data || !data.data || !data.data.length) {
                chartContainer.innerHTML = '<p>Không có dữ liệu để hiển thị.</p>';
                return;
            }

            const rawData = data.data;
            const seriesData = rawData.map((item, idx) => {
                const x = item[0];
                const y = isJsonEvent ? item[1] : item[4];
                return [x, y];
            });

            const title = wicode[idx]?.keyWord || "Dữ liệu đầu tư";
            const unit = "";

            const config = {
                chart: {
                    zoomType: 'x',
                    type: 'spline',
                    height: 500,
                    style: { fontSize: '14px' },
                },
                title: {
                    text: title,
                    align: 'center',
                },
                xAxis: {
                    type: 'datetime',
                    crosshair: true,
                    labels: {
                        formatter: function () {
                            return Highcharts.dateFormat('%e/%m/%Y', this.value);
                        },
                    },
                },
                yAxis: {
                    title: { text: unit },
                },
                tooltip: {
                    headerFormat: '<b>{point.x:%d/%m/%Y}</b><br>',
                    pointFormat: '{series.name}: {point.y:.2f}<br>',
                    shared: true,
                    useHTML: true,
                },
                credits: { enabled: false },
                exporting: { enabled: true },
                series: [{
                    name: title,
                    data: seriesData,
                    connectNulls: true,
                }],
            };

            Highcharts.chart('myChart', config, chart => {
                addRecessionPlotBands(chart);
                adjustChartPeriod(chart);
            });
        }

        function renderLoading() {
            chartContainer.innerHTML = `
    <div class="loading-container flex items-center justify-center w-full h-full bg-white bg-opacity-80">
        <div class="lds-roller">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
    </div>`;
        }

        function createFilterList(typeList) {
            filterListEl.innerHTML = '';
            const fragment = document.createDocumentFragment();

            wicode.forEach(item => {
                if (item.type === typeList) {
                    const li = document.createElement('li');
                    li.className = 'tab filter-item cursor-pointer px-3 py-2 border-b border-filter hover:bg-menu-button';
                    li.dataset.name = item.name;
                    li.textContent = item.keyWord;
                    fragment.appendChild(li);
                }
            });

            filterListEl.appendChild(fragment);
        }

        function selectTab(tabName) {
            currentTab = tabName;
            tabs.forEach(tab => {
                const isActive = tab.dataset.tab === tabName;

                tab.classList.remove(
                    'bg-btn-primary', 'text-white',
                    'bg-white', 'text-menu-link', 'hover:bg-filter'
                );

                if (isActive) {
                    tab.classList.add('bg-btn-primary', 'text-white');
                } else {
                    tab.classList.add('bg-white', 'text-menu-link', 'hover:bg-filter');
                }
            });

            createFilterList(tabName);
        }

        function filterList() {
            const filterText = searchInput.value.toLowerCase();
            const items = filterListEl.children;
            Array.from(items).forEach(li => {
                const text = li.textContent.toLowerCase();
                li.style.display = text.includes(filterText) ? '' : 'none';
            });
        }

        async function fetchData(name = 'lslnh') {
            const index = wicode.findIndex(x => x.name === name);
            let urlName = name;
            if (index === -1) urlName = 'lslnh';

            if (index > -1 && wicode[index].type === 'investing') {
                await fetchInvestingData(urlName);
                return;
            }

            renderLoading();

            try {
                let apiUrl = `https://api.wichart.vn/vietnambiz/vi-mo?name=${urlName}`;
                if (index > -1 && wicode[index].type === 'vi_mo_hang_hoa') apiUrl += '&key=hanghoa';

                const response = await fetch(apiUrl);
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                renderChart(data, index);
            } catch (error) {
                console.error('Fetch error:', error);
                chartContainer.innerHTML = '<p class="text-red-600 p-4">Đã xảy ra lỗi khi tải dữ liệu.</p>';
            }
        }

        async function fetchInvestingData(name) {
            renderLoading();

            try {
                const idx = wicode.findIndex(x => x.name === name);
                if (idx === -1) {
                    chartContainer.innerHTML = '<p>Không tìm thấy dữ liệu đầu tư.</p>';
                    return;
                }

                const isJsonEvent = wicode[idx].className.includes('json');
                const url = isJsonEvent
                    ? `https://sbcharts.investing.com/events_charts/us/${wicode[idx].className}`
                    : `https://api.investing.com/api/financialdata/${wicode[idx].className}/historical/chart/?period=MAX&interval=P1D&pointscount=120`;

                const res = await fetch(url);
                const data = await res.json();

                renderInvestingChart(data, idx, isJsonEvent);
            } catch (error) {
                console.error('Investing fetch error:', error);
                chartContainer.innerHTML = '<p class="text-red-600 p-4">Lỗi khi tải dữ liệu Investing.</p>';
            }
        }

        // Attach event listeners
        filterListEl.addEventListener('click', e => {
            const li = e.target.closest('li');
            if (!li) return;
            const name = li.dataset.name;
            if (name) fetchData(name);
        });

        searchInput.addEventListener('keyup', debounce(filterList, 200));

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                selectTab(tab.dataset.tab);
            });
        });

        // Initialize
        selectTab(currentTab);
        fetchData('lslnh');
    };

    return (
        <Card>
            <div ref={containerRef} className="w-full">
                {/* Chart will be rendered here */}
            </div>
        </Card>
    );
};

export default InteractiveChart; 