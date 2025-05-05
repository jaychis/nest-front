// src/components/AdBanner.tsx
import { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error('Adsense error:', e);
    }
  }, []);

  return (
    <ins
      className="adsbygoogle"
      style={{ display: 'block' }}
      data-ad-client="ca-pub-1680585929378303"
      data-ad-slot="XXXXXXX" // ← 여기에 본인의 광고 슬롯 ID 입력
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
};

export default AdBanner;

// import AdBanner from './components/AdBanner';

// const Home = () => {
//   return (
//     <div>
//       <h1>Welcome to Jaychis</h1>
//       <p>자유롭게 이야기하는 공간입니다.</p>

//       {/* 광고 삽입 위치 */}
//       <AdBanner />
//     </div>
//   );
// };
