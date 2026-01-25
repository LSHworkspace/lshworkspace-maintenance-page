import React from 'react';

// 별 개수 설정 (희귀성을 위해 개수 감소)
const SMALL_STAR_COUNT = 30;
const MEDIUM_STAR_COUNT = 15;
const LARGE_STAR_COUNT = 8;



export const ShootingStars: React.FC = () => {
    // 별 생성 함수
    const generateStars = (count: number, sizeClass: string) => {
        return Array.from({ length: count }).map((_, i) => {
            const finalTop = Math.random() * 100;
            const finalLeft = Math.random() * 100;

            // 화면 중앙(50%, 50%)에서 최종 위치까지의 거리 계산
            const deltaX = finalLeft - 50;
            const deltaY = finalTop - 50;

            // 랜덤 등장 타이밍 (0초 ~ 8초 사이)
            const appearDelay = Math.random() * 8;

            const style = {
                top: `${finalTop}%`,
                left: `${finalLeft}%`,
                // 랜덤화된 등장 딜레이
                '--appear-delay': `${appearDelay}s`,
                '--twinkle-delay': `${Math.random() * 5}s`,
                '--twinkle-duration': `${Math.random() * 3 + 4}s`,
                // 중앙에서 현재 위치로 이동하는 거리
                '--start-x': `${-deltaX}%`,
                '--start-y': `${-deltaY}%`,
            } as React.CSSProperties;

            return <div key={`${sizeClass}-${i}`} className={`star ${sizeClass}`} style={style} />;
        });
    };

    return (
        <div className="sky">
            {generateStars(SMALL_STAR_COUNT, 'star-small')}
            {generateStars(MEDIUM_STAR_COUNT, 'star-medium')}
            {generateStars(LARGE_STAR_COUNT, 'star-large')}
            <div className="comet" />
        </div>
    );
};
