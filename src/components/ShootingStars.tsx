import React from 'react';

// 별 개수 설정 (희귀성을 위해 개수 감소)
const SMALL_STAR_COUNT = 30;
const MEDIUM_STAR_COUNT = 15;
const LARGE_STAR_COUNT = 8;

// 별똥별로 만들 확률 (약 10%)
const SHOOTING_STAR_PROBABILITY = 0.1;

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

            // 이 별이 별똥별이 될지 결정
            const isShootingStar = Math.random() < SHOOTING_STAR_PROBABILITY;

            // 별똥별이면 나타난 후 얼마 후에 떨어질지 결정 (5초 ~ 15초 후)
            const shootDelay = isShootingStar ? appearDelay + 5 + Math.random() * 10 : 0;

            // 별똥별의 랜덤한 방향 계산 (주로 아래쪽으로, 좌우는 랜덤)
            // x: -100vw ~ 100vw (좌우 랜덤)
            // y: 50vh ~ 150vh (주로 아래로)
            const shootX = (Math.random() - 0.5) * 200; // -100 ~ 100
            const shootY = 50 + Math.random() * 100; // 50 ~ 150

            // 랜덤 떨어지는 속도 (1.5초 ~ 4초)
            const shootDuration = 1.5 + Math.random() * 2.5;

            // 각도 계산 (흔적 방향용)
            const angle = Math.atan2(shootY, shootX) * (180 / Math.PI);

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
                // 별똥별 관련
                '--shoot-delay': `${shootDelay}s`,
                '--shoot-duration': `${shootDuration}s`,
                '--shoot-x': `${shootX}vw`,
                '--shoot-y': `${shootY}vh`,
                '--shoot-angle': `${angle}deg`,
            } as React.CSSProperties;

            const className = `star ${sizeClass}${isShootingStar ? ' shooting-star' : ''}`;

            // 별똥별인 경우 파티클 스트림(Living Trail) 생성
            if (isShootingStar) {
                const cometDuration = 2 + Math.random() * 1.5; // 2~3.5초
                const particleCount = 30; // 꼬리 길이 결정

                return (
                    <div
                        key={`${sizeClass}-${i}`}
                        className="comet-group"
                        style={{
                            ...style,
                            '--shoot-duration': `${cometDuration}s`,
                        } as React.CSSProperties}
                    >
                        {/* 1. 빛나는 헤드 */}
                        <div className="comet-head" />

                        {/* 2. 뒤따라오는 파티클들 (꼬리) */}
                        {Array.from({ length: particleCount }).map((_, p) => (
                            <div
                                key={p}
                                className="particle"
                                style={{
                                    '--i': p, // 인덱스를 통해 딜레이 계산
                                    // 약간의 랜덤 흩뿌림 (먼지 효과)
                                    '--random-x': `${(Math.random() - 0.5) * 4}px`,
                                    '--random-y': `${(Math.random() - 0.5) * 4}px`,
                                } as React.CSSProperties}
                            />
                        ))}
                    </div>
                );
            }

            return <div key={`${sizeClass}-${i}`} className={className} style={style} />;
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
