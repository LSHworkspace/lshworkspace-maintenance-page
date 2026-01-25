import React from 'react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
    return (
        <motion.footer
            className="absolute z-50 w-full bottom-2 py-3 text-center text-zinc-200 text-xs md:text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 25,
                delay: 0.6
            }}
        >
            <address className="not-italic drop-shadow-lg shadow-white">
                Official Contact: <a href="mailto:contact@lshworkspace.com" className="hover:underline">contact@lshworkspace.com</a>
                <br />
                <small>ⓒ 2022 LSHworkspace. All rights reserved.</small>
            </address>
        </motion.footer>
    );
};
