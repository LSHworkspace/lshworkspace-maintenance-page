import React from 'react';
import { motion } from "framer-motion";

export const MaintenanceMessage: React.FC = () => {
    return (
        <div className="fixed flex w-full h-full bg-transparent top-0 left-0 pointer-events-none z-10">
            <motion.div
                className="m-auto text-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 76,
                    damping: 30,
                    delay: 0.3
                }}
            >
                <motion.div
                    className="text-4xl md:text-7xl lg:text-8xl opacity-0"
                    initial={{ opacity: 0, translateY: 50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 180,
                        damping: 25,
                        delay: 0.2,
                    }}
                >
                    <motion.h1
                        className="font-thin bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 via-purple-400 to-pink-400 bg-repeat drop-shadow-lg shadow-white"
                    >
                        LSHworkspace
                    </motion.h1>
                </motion.div>
                <motion.div
                    className="text-center py-1 md:py-3 "
                    initial={{ opacity: 0, translateY: 50 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 25,
                        delay: 0.6
                    }}
                >
                    <h2
                        // className="bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 via-purple-400 to-pink-400"
                        className="text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg shadow-white"
                    >
                        지금은 점검중입니다.
                    </h2>
                </motion.div>
            </motion.div>
        </div>
    );
};
