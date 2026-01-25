import React from 'react';

// 별 개수 설정
const SMALL_STAR_COUNT = 50;
const MEDIUM_STAR_COUNT = 25;
const LARGE_STAR_COUNT = 12;

export const BackgroundStars: React.FC = () => {
    // 별 생성 함수
    const generateStars = (count: number, sizeClass: string) => {
        return Array.from({ length: count }).map((_, i) => {
            const finalTop = Math.random() * 100;
            const finalLeft = Math.random() * 100;

            // 화면 중앙에서 최종 위치까지의 거리 계산
            const deltaX = finalLeft - 50;
            const deltaY = finalTop - 50;

            // 랜덤 등장 타이밍
            const appearDelay = Math.random() * 8;

            const style = {
                top: `${finalTop}%`,
                left: `${finalLeft}%`,
                '--appear-delay': `${appearDelay}s`,
                '--twinkle-delay': `${Math.random() * 5}s`,
                '--twinkle-duration': `${Math.random() * 3 + 4}s`,
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
        </div>
    );
};
