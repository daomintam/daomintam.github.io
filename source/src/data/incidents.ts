export type Incident = {
  id: string
  chain: string
  ticker: string
  date: string
  isoDate: string
  category: string
  title: string
  lead: string
  color: string
  metric: string
  metricLabel: string
  sections: [string, string, string]
  lessonTitle: string
  sources: { label: string; url: string }[]
}

// Historical accounts paraphrased from the primary sources linked below.
// Editorial lessons are synthesis, not quotations or endorsements by the projects.
export const incidents: Incident[] = [
  {
    id: 'bitcoin-2013', chain: 'Bitcoin', ticker: 'BTC', date: 'THÁNG 03 / 2013', isoDate: '2013-03', category: 'Tương thích & đồng thuận',
    title: 'Một mạng. Hai phiên bản sự thật.',
    lead: 'Một khác biệt trong phần mềm khiến các node bất đồng về cùng một block. Và Bitcoin bất ngờ rẽ thành hai nhánh.',
    color: '#f3b36a', metric: '0.7 / 0.8', metricLabel: 'Hai thế hệ phần mềm, hai cách chấp nhận block.',
    sections: [
      'Một block có nhiều đầu vào giao dịch hơn trước được tạo ra. Node phiên bản 0.8 chấp nhận, nhưng một số node cũ từ chối vì giới hạn khóa của cơ sở dữ liệu Berkeley DB. Mạng tách thành hai nhánh ngoài dự kiến.',
      'Hai pool BTCGuild và Slush hạ phiên bản node từ 0.8 xuống 0.7. Sức đào chuyển về nhánh tương thích với phần mềm cũ, giúp mạng quay lại một chuỗi chung. Một số dịch vụ cũng tạm dừng nhận tiền trong lúc xử lý.',
      'Một thay đổi ở cơ sở dữ liệu cũng có thể trở thành vấn đề đồng thuận. Kiểm thử tương thích giữa các phiên bản và phối hợp ứng phó quan trọng không kém tính năng mới.',
    ],
    lessonTitle: 'Tương thích cũng là một phần của đồng thuận.',
    sources: [{ label: 'BIP 50 · Báo cáo sau sự cố', url: 'https://github.com/bitcoin/bips/blob/master/bip-0050.mediawiki' }],
  },
  {
    id: 'ethereum-dao', chain: 'Ethereum', ticker: 'ETH', date: '20.07.2016 · DAO FORK', isoDate: '2016-07-20', category: 'Smart contract & quản trị',
    title: 'Một hợp đồng lỗi. Cả cộng đồng lựa chọn.',
    lead: 'The DAO bị khai thác. Cuộc tranh luận sau đó không chỉ là sửa mã, mà còn là quyết định nên can thiệp đến đâu.',
    color: '#b5b2ff', metric: '1.920.000', metricLabel: 'Block thực hiện DAO hard fork.',
    sections: [
      'The DAO là một ứng dụng trên Ethereum, không phải bản thân giao thức. Một lỗ hổng trong hợp đồng của nó bị khai thác năm 2016. Cộng đồng đứng trước lựa chọn gây tranh luận: thay đổi trạng thái để hỗ trợ thu hồi tiền hay giữ nguyên chuỗi.',
      'Ngày 20/7/2016, tại block 1.920.000, hard fork chuyển số ETH liên quan đến các hợp đồng DAO sang hợp đồng khôi phục WithdrawDAO. Một bộ phận cộng đồng tiếp tục chuỗi không áp dụng thay đổi, gắn với Ethereum Classic.',
      'Bảo mật hợp đồng và bảo mật giao thức là hai lớp khác nhau. Khi mã gặp sự cố, cách cộng đồng ra quyết định cũng trở thành một phần của câu chuyện công nghệ.',
    ],
    lessonTitle: 'Phần mềm có quy tắc. Cộng đồng có lựa chọn.',
    sources: [
      { label: 'Ethereum Foundation · Hard Fork Completed', url: 'https://blog.ethereum.org/2016/07/20/hard-fork-completed' },
      { label: 'ethereum.org · Lịch sử các đợt fork', url: 'https://ethereum.org/ethereum-forks' },
    ],
  },
  {
    id: 'bnb-token-hub', chain: 'BNB Chain', ticker: 'BNB', date: 'THÁNG 10 / 2022', isoDate: '2022-10', category: 'Cầu nối & xác minh',
    title: 'Cánh cửa nối hai chain trở thành điểm yếu.',
    lead: 'Một bằng chứng bị giả mạo ở cầu BSC Token Hub cho thấy rủi ro có thể nằm ở chỗ kết nối giữa các mạng.',
    color: '#efd36e', metric: '2 triệu BNB', metricLabel: 'Lượng được rút qua vụ khai thác, theo BNB Chain.',
    sections: [
      'Cầu BSC Token Hub nối BNB Beacon Chain và BNB Smart Chain bị khai thác. Theo cập nhật của BNB Chain ngày 7/10/2022, kẻ tấn công giả mạo bằng chứng trong một thư viện cấp thấp, dẫn đến việc rút tổng cộng 2 triệu BNB.',
      'Nhóm dự án liên hệ các validator để tạm dừng BNB Smart Chain, hạn chế sự cố lan rộng. Cập nhật khi đó cho biết phần lớn tài sản vẫn được kiểm soát. Lượng bị rút không đồng nghĩa với toàn bộ thiệt hại cuối cùng.',
      'Cầu nối có logic xác minh và giả định tin cậy riêng. Khi đánh giá một hệ thống blockchain, cần xem cả những đường kết nối với hệ thống khác, không chỉ chain chính.',
    ],
    lessonTitle: 'An toàn của chain không thay thế an toàn của cầu nối.',
    sources: [{ label: 'BNB Chain · Ecosystem Update, 07.10.2022', url: 'https://www.bnbchain.org/en/blog/bnb-chain-ecosystem-update' }],
  },
  {
    id: 'solana-2024', chain: 'Solana', ticker: 'SOL', date: '06.02.2024', isoDate: '2024-02-06', category: 'Độ ổn định & vận hành',
    title: 'Một vòng lặp. Khoảng năm giờ đứng lại.',
    lead: 'Lỗi biên dịch lại chương trình khiến các validator mắc kẹt. Một mạng tốc độ cao phải dừng để phối hợp khởi động lại.',
    color: '#8be2c7', metric: '≈ 5 giờ', metricLabel: 'Thời gian sự cố theo báo cáo Anza.',
    sections: [
      'Lúc 09:53 UTC ngày 6/2/2024, quá trình hoàn tất block trên Solana Mainnet Beta dừng lại. Một lỗi trong bộ nhớ đệm JIT khiến chương trình dùng loader cũ bị biên dịch lặp vô hạn; nhiều validator cùng mắc kẹt và đồng thuận ngừng tiến triển.',
      'Kỹ sư phát hành bản vá v1.17.20 và các validator phối hợp khởi động lại. Theo báo cáo Anza, đồng thuận tiếp tục lúc 14:55 UTC. Bản vá chặn điều kiện kích hoạt lỗi; các cải tiến đầy đủ hơn được đưa vào chu kỳ phát hành sau.',
      'Tốc độ xử lý và khả năng hoạt động liên tục là hai câu hỏi khác nhau. Kiểm thử trường hợp hiếm, đa dạng phần mềm và kế hoạch khôi phục đều đáng được chú ý.',
    ],
    lessonTitle: 'Nhanh đến đâu cũng cần một kế hoạch khôi phục.',
    sources: [{ label: 'Anza / Solana · Báo cáo sau sự cố', url: 'https://solana.com/news/02-06-24-solana-mainnet-beta-outage-report' }],
  },
]
