import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// 별똥별 개수
const SHOOTING_STAR_COUNT = 3;

// 트레일 파티클 개수
const TRAIL_COUNT = 25;

interface ShootingStar {
    id: string;
    startX: number;
    startY: number;
    angle: number;
    distance: number;
    duration: number;
    delay: number;
    size: number;
}

export const ShootingStars: React.FC = () => {
    // 별똥별 데이터 생성
    const shootingStars = useMemo(() => {
        const stars: ShootingStar[] = [];

        for (let i = 0; i < SHOOTING_STAR_COUNT; i++) {
            // 화면 가장자리에서 시작 (주로 위쪽)
            const edge = Math.random() < 0.7 ? 0 : Math.floor(Math.random() * 4);
            let startX = 0;
            let startY = 0;

            switch (edge) {
                case 0: // top (70% 확률)
                    startX = 20 + Math.random() * 60;
                    startY = -5;
                    break;
                case 1: // right
                    startX = 105;
                    startY = Math.random() * 50;
                    break;
                case 2: // bottom
                    startX = Math.random() * 100;
                    startY = 105;
                    break;
                case 3: // left
                    startX = -5;
                    startY = Math.random() * 50;
                    break;
            }

            // 랜덤 각도 (주로 아래쪽으로: 30도 ~ 150도)
            const angle = 30 + Math.random() * 120;

            // 거리: 50vw ~ 120vw
            const distance = 50 + Math.random() * 70;

            // 속도: 0.8초 ~ 1.8초
            const duration = 0.8 + Math.random() * 1.0;

            // 시작 지연: 3 ~ 15초
            const delay = 3 + Math.random() * 12;

            // 크기: 1 ~ 2px
            const size = 1 + Math.random() * 1;

            stars.push({
                id: `shooting-${i}`,
                startX,
                startY,
                angle,
                distance,
                duration,
                delay,
                size,
            });
        }

        return stars;
    }, []);

    return (
        <>
            {/* 별똥별들 */}
            {shootingStars.map((shootingStar) => {
                const endX = Math.cos((shootingStar.angle * Math.PI) / 180) * shootingStar.distance;
                const endY = Math.sin((shootingStar.angle * Math.PI) / 180) * shootingStar.distance;

                return (
                    <React.Fragment key={shootingStar.id}>
                        {/* 트레일 파티클들 */}
                        {Array.from({ length: TRAIL_COUNT }).map((_, index) => {
                            const progress = index / TRAIL_COUNT;

                            // 트레일 파티클의 위치 (별똥별 경로를 따라)
                            const trailX = shootingStar.startX + endX * progress;
                            const trailY = shootingStar.startY + endY * progress;

                            // 별똥별이 이 위치를 지나가는 시간
                            const appearTime = shootingStar.delay + shootingStar.duration * progress;

                            // 페이드아웃 시간 (0.2초 ~ 0.5초)
                            const fadeOutDuration = 0.2 + Math.random() * 0.3;

                            // 뒤로 갈수록 작고 흐려짐
                            const trailSize = shootingStar.size * (1 - progress * 0.4);
                            const trailOpacity = 0.9 * (1 - progress * 0.5);

                            return (
                                <motion.div
                                    key={`${shootingStar.id}-trail-${index}`}
                                    style={{
                                        position: 'absolute',
                                        left: `${trailX}%`,
                                        top: `${trailY}%`,
                                        width: trailSize,
                                        height: trailSize,
                                        borderRadius: '50%',
                                        background: 'white',
                                        boxShadow: `0 0 ${trailSize * 3}px rgba(255, 255, 255, ${trailOpacity * 0.8})`,
                                        pointerEvents: 'none',
                                    }}
                                    initial={{
                                        opacity: 0,
                                        scale: 0,
                                    }}
                                    animate={{
                                        opacity: [0, trailOpacity, 0],
                                        scale: [0, 1.2, 0.5],
                                    }}
                                    transition={{
                                        delay: appearTime,
                                        duration: fadeOutDuration,
                                        ease: 'easeOut',
                                        repeat: Infinity,
                                        repeatDelay: 12,
                                    }}
                                />
                            );
                        })}

                        {/* 메인 별똥별 */}
                        <motion.div
                            style={{
                                position: 'absolute',
                                width: shootingStar.size * 1.5,
                                height: shootingStar.size * 1.5,
                                borderRadius: '50%',
                                background: 'white',
                                boxShadow: `0 0 ${shootingStar.size * 4}px rgba(255, 255, 255, 1), 0 0 ${shootingStar.size * 8}px rgba(255, 255, 255, 0.8)`,
                                left: `${shootingStar.startX}%`,
                                top: `${shootingStar.startY}%`,
                                pointerEvents: 'none',
                            }}
                            initial={{
                                opacity: 0,
                                scale: 0,
                            }}
                            animate={{
                                x: `${endX}vw`,
                                y: `${endY}vh`,
                                opacity: [0, 1, 1, 0],
                                scale: [0, 1.5, 1.2, 0.5],
                            }}
                            transition={{
                                delay: shootingStar.delay,
                                duration: shootingStar.duration,
                                ease: 'linear',
                                repeat: Infinity,
                                repeatDelay: 12,
                            }}
                        />
                    </React.Fragment>
                );
            })}
        </>
    );
};
